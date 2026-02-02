import type { Meta } from '@storybook/react-vite'
import { useState } from 'react'

import { type RepeatMode, usePlaybackState } from '@/player/index.ts'

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
    const { isPlaying } = usePlaybackState()

    const [isShuffle, setIsShuffle] = useState(false)
    const [isRepeat, setIsRepeat] = useState<RepeatMode>('off')

    const [track] = useState(demoTrack)
    return (
      <AudioPlayer
        cover={track.cover}
        title={track.title}
        artist={track.artist}
        isPlaying={isPlaying}
        onNext={() => {}}
        onPrevious={() => {}}
        onTogglePlay={() => {}}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        onShuffle={() => setIsShuffle(!isShuffle)}
        onRepeat={() => setIsRepeat('one')}
        duration={0}
        currentTime={0}
        volume={1}
        onTimeSeek={() => {}}
        onVolumeSet={() => {}}
      />
    )
  },
}
