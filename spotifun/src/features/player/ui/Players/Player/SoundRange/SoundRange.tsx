import { type ChangeEvent, useState } from "react"
import type { PlayerLogic } from "../../../../model/PlayerLogic.ts"
import s from "./SoundRange.module.scss"
import soundIcon from "../../../../lib/img/sound-icon.svg"

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
      <img className={s.soundIcon} src={soundIcon} alt="sound icon" />
      <input className={s.soundRange} type="range" min="1" max="100" value={volume} onChange={changeVolumeHandler} />
    </div>
  )
}
