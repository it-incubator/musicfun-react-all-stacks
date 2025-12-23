import { TrackActions } from '@/features/tracks'
import { CurrentUserReaction, IconButton } from '@/shared/components'
import { PlayIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'
import { usePlayerControls, type Track } from '@/player'

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
  const { play, pause, next, previous, togglePlayPause } = usePlayerControls()

  const onClickHandler = () => {
    console.log('play track with id:')
    play(track)
  }

  return (
    <div className={s.box}>
      <IconButton onClick={onClickHandler} className={s.playButton}>
        {/*//todo: play the track*/}
        <PlayIcon />
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
