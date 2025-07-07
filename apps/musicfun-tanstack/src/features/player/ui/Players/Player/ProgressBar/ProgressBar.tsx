import { type MouseEvent } from 'react'
import type { PlayerLogic } from '../../../../model/PlayerLogic.ts'
import s from './ProgressBar.module.scss'

type Props = {
  player: PlayerLogic
}

export const ProgressBar = ({ player }: Props) => {
  const progressBarHandler = (e: MouseEvent<HTMLDivElement>) => {
    const x = e.clientX
    const totalWidth = e.currentTarget.offsetWidth
    const xInPercents = (x / totalWidth) * 100
    player.setTrackPositionByPercent(xInPercents)
  }

  return (
    <div className={s.progressBar} onClick={(e) => progressBarHandler(e)}>
      <span style={{ width: `${player.loadingProgressPercent}%` }} className={s.loading} />
      <span style={{ width: `${player.playingProgressPercent}%` }} className={s.songLength} />
    </div>
  )
}
