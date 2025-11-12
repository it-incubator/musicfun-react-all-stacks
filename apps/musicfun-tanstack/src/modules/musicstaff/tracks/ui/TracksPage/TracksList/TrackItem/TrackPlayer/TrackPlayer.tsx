import { IconButton } from '@/common/components'
import { PauseIcon, PlayIcon } from '@/common/icons'
import { usePlayer } from '@/modules/musicstaff/player/lib/hooks/usePlayer.ts'
import type { TrackOutput } from '../../../../../api/tracksApi.types.ts'
import { type MouseEvent } from 'react'

type Props = {
  track: TrackOutput
}

export const TrackPlayer = ({ track }: Props) => {
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
