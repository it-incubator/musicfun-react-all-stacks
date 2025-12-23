import { TrackActions } from '@/features/tracks'
import { CurrentUserReaction, IconButton } from '@/shared/components'
import { PauseIcon, PlayIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'
import { usePlaybackState, usePlayerControls, type Track, useCurrentTrack } from '@/player'

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

  const onClickHandler = () => {
    if (currentTrack && currentTrack.id === track.id) {
      if (isPlaying) {
        pause()
      } else {
        resume()
      }
    } else {
      play(track)
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
