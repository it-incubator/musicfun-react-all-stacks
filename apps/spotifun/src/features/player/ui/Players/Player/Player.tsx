import type { PlayerLogic, PlayerLogicTrack } from "../../../model/PlayerLogic.ts"
import { ProgressBar } from "./ProgressBar/ProgressBar.tsx"
import { PlayerControls } from "./PlayerControls/PlayerControls.tsx"
import { TrackDescr } from "./TrackDescr/TrackDescr.tsx"
import { SoundRange } from "./SoundRange/SoundRange.tsx"
import s from "./Player.module.scss"

type Props = {
  toggleMobMode: () => void
  player: PlayerLogic
  track: PlayerLogicTrack
  toggleCollapsed: () => void
}

export const Player = ({ player, toggleMobMode, toggleCollapsed, track }: Props) => {
  return (
    <div className={s.player}>
      <ProgressBar player={player} />

      <div>
        <div className={s.playerContainer}>
          <TrackDescr track={track} mobMode={false} />
          <div className={s.playerControls}>
            <PlayerControls mobMode={false} player={player} track={track} />
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
    </div>
  )
}
