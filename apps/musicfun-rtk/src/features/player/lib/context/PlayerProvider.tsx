import { type ReactNode } from 'react'
import { PlayerContext } from './PlayerContext.ts'
import type { PlayerLogic } from '../../model/PlayerLogic.ts'

type Props = {
  player: PlayerLogic
  children: ReactNode
}

export const PlayerProvider = ({ player, children }: Props) => {
  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
}
