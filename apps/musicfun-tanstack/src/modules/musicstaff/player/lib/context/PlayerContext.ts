import type { Nullable } from '@/common/types'
import type { PlayerLogic } from '../../model/PlayerLogic.ts'
import { createContext } from 'react'

export const PlayerContext = createContext<Nullable<PlayerLogic>>(null)
