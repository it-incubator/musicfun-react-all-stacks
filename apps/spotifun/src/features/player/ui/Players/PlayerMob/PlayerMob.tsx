import React from "react"
import s from "./PlayerMob.module.scss"
import { TrackDescr } from "@/features/player/ui/Players/Player/TrackDescr/TrackDescr"
import { ProgressBar } from "@/features/player/ui/Players/Player/ProgressBar/ProgressBar"
import { PlayerControls } from "@/features/player/ui/Players/Player/PlayerControls/PlayerControls"
import { PlayerLogic, PlayerLogicTrack } from "../../../Domain/PlayerLogic"

type PropsType = {
  toggleMobMode: () => void
  player: PlayerLogic
  track: PlayerLogicTrack
}

export const PlayerMob = (props: PropsType) => {
  return (
    <div className={s.container}>
      <div className={s.btnCloseContainer}>
        <button className={s.btnClose} onClick={props.toggleMobMode}>
          {" "}
        </button>
      </div>
      <div className={s.content}>
        <TrackDescr track={props.track} mobMode={true} />
        <div className={s.progressBarContainer}>
          <ProgressBar player={props.player} />
        </div>
        <PlayerControls player={props.player} track={props.track} mobMode={true} />
      </div>
    </div>
  )
}
