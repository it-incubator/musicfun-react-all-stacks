import type { Meta } from '@storybook/react-vite'
import { useState } from 'react'

import { AudioPlayer } from './AudioPlayer.tsx'

const meta = {
  title: 'Components/Player',
  component: AudioPlayer,
  parameters: {},
  args: {},
} satisfies Meta<typeof AudioPlayer>

export default meta

const demoTrack = {
  src: 'https://cdn.uppbeat.io/audio-files/c636d7c86452449b1203fc0bded83e29/4358717fc9da477a52fb18a6cbd3afcc/d154b5ce5ff1a05ae8115a3c678062e8/STREAMING-dreamland-matrika-main-version-31140-02-25.mp3',
  cover: 'https://unsplash.it/112/112',
  title: 'Play It Safe',
  artist: 'Julia Wolf',
}

export const Basic = {
  render: () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isShuffle, setIsShuffle] = useState(false)
    const [isRepeat, setIsRepeat] = useState(false)

    const [track] = useState(demoTrack)
    return (
      <AudioPlayer
        {...track}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={() => {}}
        onPrevious={() => {}}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        onShuffle={() => setIsShuffle(!isShuffle)}
        onRepeat={() => setIsRepeat(!isRepeat)}
      />
    )
  },
}
