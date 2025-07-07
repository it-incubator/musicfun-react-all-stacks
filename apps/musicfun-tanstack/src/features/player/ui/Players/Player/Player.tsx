import type { BaseAttributes, TrackDetails } from '../../../../tracks/api/tracksApi.types.ts'
import { PlayerDescription } from './PlayerDescription/PlayerDescription.tsx'
import type { PlayerLogic } from '../../../model/PlayerLogic.ts'
import { PlayerControls } from './PlayerControls/PlayerControls.tsx'
import { ProgressBar } from './ProgressBar/ProgressBar.tsx'
import { SoundRange } from './SoundRange/SoundRange.tsx'
import s from './Player.module.scss'

type Props<T extends BaseAttributes> = {
  toggleMobMode: () => void
  player: PlayerLogic
  track: TrackDetails<T>
  toggleCollapsed: () => void
}

export const Player = <T extends BaseAttributes>({ player, toggleMobMode, toggleCollapsed, track }: Props<T>) => {
  return (
    <div className={s.player}>
      <ProgressBar player={player} />

      <div className={s.playerContainer}>
        <PlayerDescription track={track} mobMode={false} />
        <div className={s.playerControls}>
          <PlayerControls player={player} track={track} />
        </div>
        <div className={s.soundRangeContainer}>
          <SoundRange player={player} />
          <button className={s.btnCollapsed} onClick={toggleCollapsed} />
        </div>
        <div className={s.btnOpenContainer}>
          <button className={s.btnOpen} onClick={toggleMobMode} />
          <button className={s.btnCollapsed} onClick={toggleCollapsed} />
        </div>
      </div>
    </div>
  )
}
