import { useState } from 'react'
import { TrackActions } from '@/features/tracks'
import { CurrentUserReaction, IconButton } from '@/shared/components'
import { PauseIcon, PlayIcon } from '@/shared/icons'

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
  const { play, pause } = usePlayerControls()
  const [isPlaying, setIsPlaying] = useState(false)

  const onClickHandler = () => {
    if (isPlaying) {
      pause()
    } else {
      play(track)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className={s.box}>
      <IconButton onClick={onClickHandler} className={s.playButton}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
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
