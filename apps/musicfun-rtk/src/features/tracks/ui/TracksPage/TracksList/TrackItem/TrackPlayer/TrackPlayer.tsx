import { IconButton } from '@/common/components'
import { PauseIcon, PlayIcon } from '@/common/icons'

import { type MouseEvent } from 'react'
import type { BaseAttributes, TrackDetails } from '../../../../../api/tracksApi.types.ts'
import type { PlayerLogic } from '@/features/player/model/PlayerLogic.ts'

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
  isPlayingMe: boolean
  player: PlayerLogic
}

export const TrackPlayer = <T extends BaseAttributes>({ track, player, isPlayingMe }: Props<T>) => {
  const playHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (isPlayingMe) {
      player.pause()
    } else {
      player.play(track)
    }
  }

  return <IconButton onClick={playHandler}>{isPlayingMe ? <PauseIcon /> : <PlayIcon />}</IconButton>
}
