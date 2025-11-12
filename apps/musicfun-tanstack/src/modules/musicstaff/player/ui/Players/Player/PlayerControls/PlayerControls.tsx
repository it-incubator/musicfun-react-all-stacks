import { IconButton } from '@/common/components'
import { NextTrackIcon, PauseIcon, PlayIcon } from '@/common/icons'
import type { BaseAttributes, TrackDetails } from '@/modules/musicstaff/tracks/api/tracksApi.types.ts'
import type { PlayerLogic } from '../../../../model/PlayerLogic.ts'

type Props<T extends BaseAttributes> = {
  player: PlayerLogic
  track: TrackDetails<T>
}

export const PlayerControls = <T extends BaseAttributes>({ player, track }: Props<T>) => {
  const playHandler = () => {
    if (player.isPlaying) {
      player.pause()
    } else {
      player.play(track)
    }
  }

  return (
    <div className={'flex-container'}>
      <IconButton onClick={() => player.playPrev()}>
        <NextTrackIcon type={'prev'} />
      </IconButton>
      <IconButton onClick={playHandler}>{player.isPlaying ? <PauseIcon /> : <PlayIcon />}</IconButton>
      <IconButton onClick={() => player.playNext()}>
        <NextTrackIcon type={'next'} />
      </IconButton>
    </div>
  )
}
