import { t } from 'i18next'
import { useDispatch } from 'react-redux'

import { TracksTable, useCreateTrackModal } from '@/features/tracks'
import { TrackActions } from '@/features/tracks/ui/TrackActions/TrackActions'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { useOwnerData } from '@/pages/UserPage/hooks'
import { loadPlaylist } from '@/player'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Button } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import s from './TracksTab.module.css'

export const TracksTab = () => {
  const { isProfileOwner, tracks, pageOwnerId } = useOwnerData()
  const { handleOpenCreateTrackModal } = useCreateTrackModal()

  const dispatch = useDispatch()

  const handleTrackPlayClick = (trackId: string) => {
    if (!tracks) return
    const tracksForRedux = tracks.data.map((t) => {
      const image = getImageByType(t.attributes.images, ImageType.MEDIUM)
      return {
        id: t.id,
        title: t.attributes.title,
        artist: 'artist',
        url: t.attributes.attachments[0].url,
        duration: 100,
        albumArt: image?.url || noCoverPlaceholder,
      }
    })
    dispatch(
      loadPlaylist({
        playlistId: `${pageOwnerId}-user-tracks`,
        tracks: tracksForRedux,
        startIndex: tracksForRedux?.findIndex((t) => t.id === trackId),
      })
    )
  }

  // FIXME: temporary build fix, need to add url
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
            console.log(image, track.attributes.images)

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
