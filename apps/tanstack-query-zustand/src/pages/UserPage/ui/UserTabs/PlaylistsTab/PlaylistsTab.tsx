import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'

import { PlaylistCard } from '@/entities/playlist'
import { CreatePlaylistModal } from '@/features/playlists'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { ContentList } from '@/pages/common'
import {
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
} from '@/shared/api/schema'
import { Button, Pagination } from '@/shared/components'
import { useUIStore } from '@/shared/model/ui-store'
import { useUserPageData } from '../../../hooks'

import s from './PlaylistsTab.module.css'

const PAGE_SIZE = 8
const DEFAULT_PAGE = 1

export const PlaylistsTab = () => {
  const { t } = useTranslation()
  const { id: userId } = useParams<{ id: string }>()
  const { isProfileOwner } = useUserPageData()
  const [searchParams, setSearchParams] = useSearchParams()

  const { isCreatePlaylistModalOpen, openCreatePlaylistModal, closeCreatePlaylistModal } =
    useUIStore()

  const pageNumber = Number(searchParams.get('page')) || DEFAULT_PAGE

  const queryParams = useMemo(
    () => ({
      pageNumber,
      pageSize: PAGE_SIZE,
      sortBy: PathsPlaylistsGetParametersQuerySortBy.addedAt,
      sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
      userId: userId || undefined,
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

  return (
    <>
      {isProfileOwner && (
        <Button className={s.createPlaylistButton} onClick={() => openCreatePlaylistModal()}>
          {t('playlists.button.create_playlist')}
        </Button>
      )}

      {isCreatePlaylistModalOpen && <CreatePlaylistModal onClose={closeCreatePlaylistModal} />}

      {isError && <div>Failed to load playlists</div>}

      {!isLoading && !isError && playlists.length > 0 && (
        <ContentList
          data={playlists}
          listClassName={s.playlistsList}
          renderItem={(playlist) => (
            <PlaylistCard
              canEdit={isProfileOwner}
              id={playlist.id}
              images={playlist.attributes.images || { main: [] }}
              key={playlist.id}
              title={playlist.attributes.title}
              tracksCount={playlist.attributes.tracksCount}
            />
          )}
        />
      )}
      {!isLoading && !isError && playlists.length === 0 && (
        <div className={s.emptyState}>{t('playlists.title.no_playlists')}</div>
      )}

      {!isLoading && !isError && (
        <Pagination
          page={pageNumber}
          pagesCount={Math.max(1, totalPages)}
          onPageChange={handlePageChange}
          alwaysVisible
        />
      )}
    </>
  )
}
