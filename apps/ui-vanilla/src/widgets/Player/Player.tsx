import { useState } from 'react'

import { AudioPlayer } from '@/shared/components'

import s from './Player.module.css'

const MOCK_TRACK = {
  src: 'https://cdn.uppbeat.io/audio-files/c636d7c86452449b1203fc0bded83e29/4358717fc9da477a52fb18a6cbd3afcc/d154b5ce5ff1a05ae8115a3c678062e8/STREAMING-dreamland-matrika-main-version-31140-02-25.mp3',
  cover: 'https://unsplash.it/112/112',
  title: 'Play It Safe',
  artist: 'Julia Wolf',
}

export const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)

  return (
    <AudioPlayer
      {...MOCK_TRACK}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
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
