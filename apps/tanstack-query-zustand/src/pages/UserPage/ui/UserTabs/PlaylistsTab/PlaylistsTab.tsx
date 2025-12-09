import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router'

import { PlaylistCard } from '@/entities/playlist'
import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { CreatePlaylistModal } from '@/features/playlists'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { ContentList } from '@/pages/common'
import {
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
  type SchemaGetPlaylistsRequestPayload,
} from '@/shared/api/schema'
import { Button, Pagination } from '@/shared/components'

import s from './PlaylistsTab.module.css'

const PAGE_SIZE = 8
const DEFAULT_PAGE = 1

export const PlaylistsTab = () => {
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false) // STATE FOR TESTING
  const [pageNumber, setPageNumber] = useState<number>(DEFAULT_PAGE)
  const { id: userId } = useParams<{ id: string }>()
  const { data: me } = useMeQuery()

  // todo:task load user playlists

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
  const canEditPlaylist = me?.userId === userId

  const openCreatePlaylistModal = () => {
    setIsCreatePlaylistModalOpen(true)
  }

  const handlePageChange = useCallback((page: SchemaGetPlaylistsRequestPayload['pageNumber']) => {
    setPageNumber(page)
  }, [])

  return (
    <>
      <Button className={s.createPlaylistButton} onClick={openCreatePlaylistModal}>
        Create Playlist
      </Button>

      {isCreatePlaylistModalOpen && (
        <CreatePlaylistModal onClose={() => setIsCreatePlaylistModalOpen(false)} />
      )}

      {isLoading && <div>Loading playlists...</div>}
      {isError && <div>Failed to load playlists</div>}

      {!isLoading && !isError && playlists.length > 0 && (
        <ContentList
          data={playlists}
          renderItem={(playlist) => (
            <PlaylistCard
              //Todo: playlist editing will work when the data is not mock.
              canEdit={canEditPlaylist}
              description={playlist.attributes.description}
              id={playlist.id}
              images={playlist.attributes.images || { main: [] }}
              key={playlist.id}
              title={playlist.attributes.title}
            />
          )}
        />
      )}
      {/* temporary placeholder if there are no playlists */}
      {!isLoading && !isError && playlists.length === 0 && (
        <div className={s.emptyState}>No playlists yet.</div>
      )}

      {totalPages > 1 && (
        <Pagination page={pageNumber} pagesCount={totalPages} onPageChange={handlePageChange} />
      )}
    </>
  )
}
