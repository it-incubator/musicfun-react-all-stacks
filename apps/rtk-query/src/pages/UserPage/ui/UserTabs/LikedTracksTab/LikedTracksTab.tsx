import { t } from 'i18next'
import { useMemo } from 'react'

import { TracksTable, useFetchTracksQuery } from '@/features/tracks'
import { TrackActions } from '@/features/tracks/ui/TrackActions/TrackActions'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { useOwnerData } from '@/pages/UserPage/hooks'
import { selectCurrentPlaylistId, usePlayerControls, useQueueControls } from '@/player'
import { convertApiTracksToPlayerTracks } from '@/player/utils/convert-api-track-to-player-track.ts'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Pagination } from '@/shared/components'
import { useAppSelector } from '@/shared/hooks'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { usePageSearchParams } from '@/pages/common/hooks'

export const LikedTracksTab = () => {
  const { pageOwnerId, isProfileOwner } = useOwnerData()
  const { pageNumber, handlePageChange } = usePageSearchParams()

  const { data: tracksResponse, isLoading } = useFetchTracksQuery({
    userId: pageOwnerId,
    pageNumber,
    pageSize: 10,
  })

  const { play } = usePlayerControls()
  const { loadPlaylist } = useQueueControls()
  const playerPlaylistId = useAppSelector(selectCurrentPlaylistId)

  const currentPlaylistId = `${pageOwnerId}-liked-tracks`
  const playerTracks = useMemo(
    () => tracksResponse && convertApiTracksToPlayerTracks(tracksResponse.data),
    [tracksResponse]
  )

  const handleTrackPlayClick = (trackId: string) => {
    if (!playerTracks) return
    const playerTrackIndex = playerTracks.findIndex((track) => track.id === trackId)
    if (playerPlaylistId !== currentPlaylistId) {
      loadPlaylist(currentPlaylistId, playerTracks, playerTrackIndex)
    }
    const playerTrack = playerTracks.find((track) => track.id === trackId)
    if (playerTrack) {
      play(playerTrack, currentPlaylistId)
    }
  }

  if (isLoading) return null

  return (
    <>
      <TracksTable
        trackRows={
          tracksResponse?.data?.map((track, index) => {
            const image = getImageByType(track.attributes.images, ImageType.MEDIUM)
            return {
              index,
              id: track.id,
              title: track.attributes.title,
              imageSrc: image?.url || noCoverPlaceholder,
              addedAt: track.attributes.addedAt,
              artists: ['Artist 1', 'Artist 2'],
              duration: 100,
              likesCount: track.attributes.likesCount,
              dislikesCount: track.attributes.dislikesCount,
              currentUserReaction: track.attributes.currentUserReaction,
              url: track.attributes.attachments[0]?.url || '',
              isPublished: track.attributes.isPublished,
            }
          }) ?? []
        }
        renderTrackRow={(trackRow) => (
          <TrackRow
            key={trackRow.id}
            trackRow={trackRow}
            onTrackPlayClick={handleTrackPlayClick}
            renderActionsCell={() => (
              <TrackActions
                trackId={trackRow.id}
                isOwner={isProfileOwner}
                isPublished={trackRow.isPublished}
                reaction={undefined}
                likesCount={undefined}
              />
            )}
          />
        )}
      />
      {tracksResponse && (
        <Pagination
          page={pageNumber}
          pagesCount={tracksResponse.meta.pagesCount || 1}
          onPageChange={handlePageChange}
          alwaysVisible
        />
      )}
    </>
  )
}
