import { useState } from 'react'

import { AudioPlayer } from '@/shared/components'

import s from './Player.module.css'

export const Player = () => {
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)

  return (
    <AudioPlayer
      onNext={() => {}}
      onPrevious={() => {}}
      isShuffle={isShuffle}
      isRepeat={isRepeat}
      onShuffle={() => setIsShuffle(!isShuffle)}
      onRepeat={() => setIsRepeat(!isRepeat)}
      className={s.player}
    />
  )
}
