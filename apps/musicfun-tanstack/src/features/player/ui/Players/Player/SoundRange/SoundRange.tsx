import { SoundIcon } from '@/common/icons'
import { type ChangeEvent, useState } from 'react'
import type { PlayerLogic } from '../../../../model/PlayerLogic.ts'
import s from './SoundRange.module.scss'

type Props = {
  player: PlayerLogic
}

export const SoundRange = ({ player }: Props) => {
  const [volume, setVolume] = useState(50)

  const changeVolumeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const trackVolume = event.currentTarget.valueAsNumber
    setVolume(trackVolume)
    player.changeVolume(trackVolume / 100)
  }

  return (
    <div className={s.sound}>
      <SoundIcon />
      <input
        className={s.soundRange}
        type="range"
        min="1"
        max="100"
        value={volume}
        style={{
          background: `linear-gradient(90deg, var(--highlight) ${volume}%, #c8c8c8 ${volume}%)`,
        }}
        onChange={changeVolumeHandler}
      />
    </div>
  )
}
