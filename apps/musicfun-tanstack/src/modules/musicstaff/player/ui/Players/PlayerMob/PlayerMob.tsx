import type { BaseAttributes, TrackDetails } from '@/modules/musicstaff/tracks/api/tracksApi.types.ts'
import { PlayerDescription } from '../Player/PlayerDescription/PlayerDescription.tsx'
import { PlayerLogic } from '../../../model/PlayerLogic.ts'
import { PlayerControls } from '../Player/PlayerControls/PlayerControls.tsx'
import { ProgressBar } from '../Player/ProgressBar/ProgressBar.tsx'
import s from './PlayerMob.module.scss'

type Props<T extends BaseAttributes> = {
  toggleMobMode: () => void
  player: PlayerLogic
  track: TrackDetails<T>
}

export const PlayerMob = <T extends BaseAttributes>({ player, track, toggleMobMode }: Props<T>) => {
  return (
    <div className={s.container}>
      <div className={s.btnCloseContainer}>
        <button className={s.btnClose} onClick={toggleMobMode} />
      </div>
      <div className={s.content}>
        <PlayerDescription track={track} mobMode={true} />
        <div className={s.progressBarContainer}>
          <ProgressBar player={player} />
        </div>
        <PlayerControls player={player} track={track} />
      </div>
    </div>
  )
}
