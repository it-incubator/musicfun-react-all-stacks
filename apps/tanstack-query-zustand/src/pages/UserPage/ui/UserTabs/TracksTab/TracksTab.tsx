import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router'

import { TracksTable } from '@/features/tracks'
import { useTracks } from '@/features/tracks/api/use-tracks.query.ts'
import { CreateTrackModal } from '@/features/tracks/ui/CreateTrackForm/CreateTrackModal'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import {
  PathsPlaylistsGetParametersQuerySortDirection,
  PathsPlaylistsTracksGetParametersQueryPaginationType,
  PathsPlaylistsTracksGetParametersQuerySortBy,
  type SchemaGetTracksRequestPayload,
} from '@/shared/api/schema.ts'
import { Button, Pagination } from '@/shared/components'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { MoreIcon } from '@/shared/icons'

import s from './TracksTab.module.css'

const PAGE_SIZE = 10
const DEFAULT_PAGE = 1

export const TracksTab = () => {
  const [isUploadTrackModalOpen, setIsUploadTrackModalOpen] = useState(false) // STATE FOR TESTING

  const [pageNumber, setPageNumber] = useState<number>(DEFAULT_PAGE)
  const { id: userId } = useParams<{ id: string }>()

  const queryParams = useMemo<SchemaGetTracksRequestPayload>(
    () => ({
      pageNumber,
      pageSize: PAGE_SIZE,
      sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.publishedAt,
      sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
      search: undefined,
      tagsIds: undefined,
      artistsIds: undefined,
      userId: userId || undefined,
      includeDrafts: true,
      paginationType: PathsPlaylistsTracksGetParametersQueryPaginationType.offset,
      cursor: undefined,
    }),
    [pageNumber, userId]
  )

  const { data, isLoading, isError } = useTracks(queryParams)
  const tracks = data?.data?.data ?? []
  const totalPages = data?.data?.meta.pagesCount ?? 1

  const openUploadTrackModal = () => {
    setIsUploadTrackModalOpen(true)
  }

  const handlePageChange = useCallback((page: SchemaGetTracksRequestPayload['pageNumber']) => {
    setPageNumber(page)
  }, [])

  // todo:task load user tracks

  return (
    <>
      <Button className={s.uploadTrackButton} onClick={openUploadTrackModal}>
        Upload Track
      </Button>
      {isUploadTrackModalOpen && (
        <CreateTrackModal onClose={() => setIsUploadTrackModalOpen(false)} />
      )}

      {isLoading && <div>Loading tracks...</div>}
      {isError && <div>Failed to load tracks</div>}
      {!isLoading && !isError && tracks.length > 0 && (
        <TracksTable
          trackRows={tracks.map((track, index) => ({
            index,
            id: track.id,
            title: track.attributes.title,
            image: track.attributes.images.main?.[0]?.url,
            addedAt: track.attributes.addedAt,
            artists: [], // track.attributes.artists?.map((artist) => artist.name) || [],
            duration: 0, // track.attributes.duration,
            ownerId: track.attributes.user.id,
          }))}
          renderTrackRow={(trackRow) => (
            <TrackRow
              trackRow={trackRow}
              renderActionsCell={() => (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {/* todo:task if it's current logined user track, show edit popup and implement edit */}
                    <DropdownMenuItem onClick={() => alert('Edit clicked!')}>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        // todo:task implement feature
                        alert('Add to playlist clicked!')
                      }}>
                      Add to playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
                      Show text song
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          )}
        />
      )}

      {totalPages > 1 && (
        <Pagination page={pageNumber} pagesCount={totalPages} onPageChange={handlePageChange} />
      )}
    </>
  )
}
