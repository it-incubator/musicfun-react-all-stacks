import { TrackActions } from '@/features/tracks'
import { CurrentUserReaction, IconButton } from '@/shared/components'
import { PlayIcon } from '@/shared/icons'

import s from './ControlPanel.module.css'

export const ControlPanel = ({
  trackId,
  isOwnTrack,
  reaction,
  likesCount,
}: {
  trackId: string
  isOwnTrack: boolean
  reaction: CurrentUserReaction
  likesCount: number
}) => {
  const onClickHandler = () => {
    console.log('play track with id:')
  }

  return (
    <div style={{ border: '2px solid red' }} className={s.box}>
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
