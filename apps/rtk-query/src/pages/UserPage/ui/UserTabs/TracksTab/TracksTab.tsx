import { t } from 'i18next'
import { useMemo } from 'react'

import { TracksTable, useCreateTrackModal } from '@/features/tracks'
import { TrackActions } from '@/features/tracks/ui/TrackActions/TrackActions'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { useOwnerData } from '@/pages/UserPage/hooks'
import { selectCurrentPlaylistId, usePlayerControls, useQueueControls } from '@/player'
import { convertApiTracksToPlayerTracks } from '@/player/utils/convert-api-track-to-player-track.ts'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Button } from '@/shared/components'
import { useAppSelector } from '@/shared/hooks'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import s from './TracksTab.module.css'

export const TracksTab = () => {
  const { isProfileOwner, tracks, pageOwnerId } = useOwnerData()
  const { handleOpenCreateTrackModal } = useCreateTrackModal()
  const { play } = usePlayerControls()
  const { loadPlaylist } = useQueueControls()
  const playerPlaylistId = useAppSelector(selectCurrentPlaylistId)

  const currentPlaylistId = `${pageOwnerId}-user-tracks`
  const playerTracks = useMemo(
    () => tracks && convertApiTracksToPlayerTracks(tracks.data),
    [tracks]
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

  return (
    <>
      {isProfileOwner && (
        <Button className={s.uploadTrackButton} onClick={handleOpenCreateTrackModal}>
          {t('tracks.button.upload_track')}
        </Button>
      )}
      <TracksTable
        trackRows={
          tracks?.data?.map((track, index) => {
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
              url: track.attributes.attachments[0].url,
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
                reaction={undefined}
                likesCount={undefined}
              />
              // <DropdownMenu>
              //   <DropdownMenuTrigger>
              //     <MoreIcon />
              //   </DropdownMenuTrigger>
              //   <DropdownMenuContent>
              //     <DropdownMenuItem onClick={() => handleOpenEditTrackModal(trackRow.id)}>
              //       Edit
              //     </DropdownMenuItem>
              //     <DropdownMenuItem onClick={() => alert('Add to playlist clicked!')}>
              //       Add to playlist
              //     </DropdownMenuItem>
              //     <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
              //       Show text song
              //     </DropdownMenuItem>
              //   </DropdownMenuContent>
              // </DropdownMenu>
            )}
          />
        )}
      />
    </>
  )
}
