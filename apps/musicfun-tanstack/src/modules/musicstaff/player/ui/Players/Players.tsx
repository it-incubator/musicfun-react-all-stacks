import { useState } from 'react'
import { usePlayer } from '../../lib/hooks/usePlayer.ts'
import { PlayerMob } from './PlayerMob/PlayerMob.tsx'
import { Player } from './Player/Player.tsx'
import s from './Players.module.scss'

export const Players = () => {
  const [mobMode, setMobMode] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [player] = usePlayer(true, null)

  const track = player.currentTrack

  const toggleMobMode = () => setMobMode(!mobMode)

  const toggleCollapsed = () => setIsCollapsed(!isCollapsed)

  if (!track) return null

  if (isCollapsed) {
    return (
      <div onClick={toggleCollapsed}>
        <div className={s.bg} />
        <button className={`${s.playBeatButton} ${s.play}`} />
      </div>
    )
  }

  if (mobMode) {
    return <PlayerMob toggleMobMode={toggleMobMode} player={player} track={track} />
  }

  return <Player toggleMobMode={toggleMobMode} toggleCollapsed={toggleCollapsed} player={player} track={track} />
}
