import { TrackActions, useLazyFetchTrackByIdQuery } from '@/features/tracks'
import { type Track, useCurrentTrack, usePlaybackState, usePlayerControls } from '@/player'
import { CurrentUserReaction, IconButton } from '@/shared/components'
import { PauseIcon, PlayIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'

export const ControlPanel = ({
  trackId,
  isOwnTrack,
  reaction,
  likesCount,
  track,
}: {
  track: Track
  trackId: string
  isOwnTrack: boolean
  reaction: CurrentUserReaction
  likesCount: number
}) => {
  const { play, pause, resume } = usePlayerControls()
  const { isPlaying } = usePlaybackState()
  const { track: currentTrack } = useCurrentTrack()
  const [fetchTrack] = useLazyFetchTrackByIdQuery()

  const onClickHandler = async () => {
    // debugger
    if (currentTrack && currentTrack.id === track.id) {
      if (isPlaying) {
        pause()
      } else {
        resume()
      }
    } else {
      // Fetch the full track details before playing
      try {
        const result = await fetchTrack({ trackId: trackId })
        if (result.data?.data) {
          const fullTrack: Track = {
            id: result.data.data.id,
            title: result.data.data.attributes.title,
            artist: result.data.data.attributes.artists[0]?.name || 'Unknown Artist',
            duration: result.data.data.attributes.duration,
            url: result.data.data.attributes.attachments[0]?.url || '',
            albumArt: result.data.data.attributes.images?.main?.[0]?.url,
          }
          play(fullTrack)
        }
      } catch (error) {
        console.error('Failed to fetch track:', error)
        // Fallback to the track we already have
        play(track)
      }
    }
  }

  const isCurrentTrack = currentTrack && currentTrack.id === track.id

  return (
    <div className={s.box}>
      <IconButton onClick={onClickHandler} className={s.playButton}>
        {isCurrentTrack && isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>

      <TrackActions
        trackId={trackId}
        reaction={reaction}
        likesCount={likesCount}
        sizeReactionButtons="large"
        isOwner={isOwnTrack}
      />
    </div>
  )
}
