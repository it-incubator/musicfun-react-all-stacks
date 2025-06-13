import { PlayerLogic, type PlayerLogicTrack } from "../../../model/PlayerLogic.ts"
import { TrackDescr } from "../Player/TrackDescr/TrackDescr.tsx"
import { ProgressBar } from "../Player/ProgressBar/ProgressBar.tsx"
import { PlayerControls } from "../Player/PlayerControls/PlayerControls.tsx"
import s from "./PlayerMob.module.scss"

type Props = {
  toggleMobMode: () => void
  player: PlayerLogic
  track: PlayerLogicTrack
}

export const PlayerMob = ({ player, track, toggleMobMode }: Props) => {
  return (
    <div className={s.container}>
      <div className={s.btnCloseContainer}>
        <button className={s.btnClose} onClick={toggleMobMode} />
      </div>
      <div className={s.content}>
        <TrackDescr track={track} mobMode={true} />
        <div className={s.progressBarContainer}>
          <ProgressBar player={player} />
        </div>
        <PlayerControls player={player} track={track} mobMode={true} />
      </div>
    </div>
  )
}
