import { useCallback, useMemo, useState } from 'react'

import { PlaylistCard } from '@/entities/playlist'
import { CreatePlaylistModal } from '@/features/playlists'
import {
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
  type SchemaGetPlaylistsRequestPayload,
} from '@/shared/api/schema'
import { ContentList } from '@/pages/common'
import { Button, Pagination } from '@/shared/components'

import s from './PlaylistsTab.module.css'
import { useParams } from 'react-router'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'

const PAGE_SIZE = 8
const DEFAULT_PAGE = 1

export const PlaylistsTab = () => {
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false) // STATE FOR TESTING
  const [pageNumber, setPageNumber] = useState<number>(DEFAULT_PAGE)
  const { id: userId } = useParams<{ id: string }>()

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
              key={playlist.id}
              id={playlist.id}
              title={playlist.attributes.title}
              images={playlist.attributes.images || { main: [] }}
              description={playlist.attributes.description}
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
