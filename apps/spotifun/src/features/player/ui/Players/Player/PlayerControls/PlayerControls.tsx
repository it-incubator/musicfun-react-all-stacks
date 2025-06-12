import type { PlayerLogic, PlayerLogicTrack } from "../../../../model/PlayerLogic.ts"
import s from "./PlayerControls.module.scss"

type Props = {
  mobMode: boolean
  player: PlayerLogic
  track: PlayerLogicTrack
}

export const PlayerControls = ({ mobMode, player, track }: Props) => {
  const pauseHandler = () => player.pause()
  const playHandler = () => player.play(track)
  const prevTrackHandler = () => player.playPrev()
  const nextTrackHandler = () => player.playNext()

  return (
    <div className={mobMode ? s.playerControlsMob : s.playerControls}>
      <button className={mobMode ? s.prevBeatButtonMob : s.prevBeatButton} onClick={prevTrackHandler} />
      {player.isPlaying ? (
        <button className={`${s.playBeatButton} ${s.pause}`} onClick={pauseHandler} />
      ) : (
        <button className={`${s.playBeatButton} ${s.play}`} onClick={playHandler} />
      )}
      <button className={mobMode ? s.nextBeatButtonMob : s.nextBeatButton} onClick={nextTrackHandler} />
    </div>
  )
}
