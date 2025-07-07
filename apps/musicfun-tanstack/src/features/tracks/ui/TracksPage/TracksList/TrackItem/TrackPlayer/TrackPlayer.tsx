import { IconButton } from '@/common/components'
import { PauseIcon, PlayIcon } from '@/common/icons'
import { usePlayer } from '@/features/player/lib/hooks/usePlayer.ts'
import type { BaseAttributes, TrackDetails } from '../../../../../api/tracksApi.types.ts'
import { type MouseEvent } from 'react'

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
}

export const TrackPlayer = <T extends BaseAttributes>({ track }: Props<T>) => {
  const [player, isPlayingMe] = usePlayer(false, track)

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
