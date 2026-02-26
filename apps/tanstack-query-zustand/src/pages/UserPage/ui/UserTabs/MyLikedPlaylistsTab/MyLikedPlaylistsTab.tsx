import { useCallback, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'

import { PlaylistCard } from '@/entities/playlist'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { usePlaylistReactions } from '@/features/playlists/model/usePlaylistReactions'
import { ContentList } from '@/pages/common'
import { Pagination, ReactionButtons } from '@/shared/components'
import {
  type components,
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
} from '@/shared/api/schema'
import s from './MyLikedPlaylistsTab.module.css'

const PAGE_SIZE = 5
const DEFAULT_PAGE = 1
type PlaylistListItem = components['schemas']['PlaylistListItemResource']

const LikedPlaylistCard = ({ playlist }: { playlist: PlaylistListItem }) => {
  const { handleLike, handleDislike, handleRemoveReaction } = usePlaylistReactions(playlist.id)

  return (
    <PlaylistCard
      id={playlist.id}
      title={playlist.attributes.title}
      images={playlist.attributes.images}
      userName={playlist.attributes.user.name}
      userId={playlist.attributes.user.id}
      addedAt={playlist.attributes.addedAt}
      tracksCount={playlist.attributes.tracksCount}
      shouldShowOwnerName
      shouldShowCreatedDate
      footer={
        <ReactionButtons
          entityId={playlist.id}
          currentReaction={playlist.attributes.currentUserReaction}
          likesCount={playlist.attributes.likesCount}
          onLike={handleLike}
          onDislike={handleDislike}
          onRemoveReaction={handleRemoveReaction}
        />
      }
    />
  )
}

export const MyLikedPlaylistsTab = () => {
  const { t } = useTranslation()
  const { id: userId } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const pageNumber = Number(searchParams.get('page')) || DEFAULT_PAGE

  const queryParams = useMemo(
    () => ({
      pageNumber,
      pageSize: PAGE_SIZE,
      sortBy: PathsPlaylistsGetParametersQuerySortBy.addedAt,
      sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
      userId: userId,
    }),
    [pageNumber, userId]
  )

  const { data, isLoading, isError } = usePlaylists(queryParams)
  const playlists = data?.data?.data ?? []
  const totalPages = data?.data?.meta.pagesCount ?? 1

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)

        if (page === DEFAULT_PAGE) {
          next.delete('page')
        } else {
          next.set('page', page.toString())
        }

        return next
      })
    },
    [setSearchParams]
  )

  if (isLoading) return null
  if (isError) return <div>Failed to load playlists</div>

  return (
    <>
      <ContentList
        data={playlists}
        listClassName={s.playlistsList}
        renderItem={(playlist) => <LikedPlaylistCard playlist={playlist} />}
      />
      <Pagination
        page={pageNumber}
        pagesCount={Math.max(1, totalPages)}
        onPageChange={handlePageChange}
        alwaysVisible
      />
    </>
  )
}
