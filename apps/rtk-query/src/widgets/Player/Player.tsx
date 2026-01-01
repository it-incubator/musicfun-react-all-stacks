import { useState } from 'react'

import {
  nextTrack,
  previousTrack,
  selectIsLoadingTrack,
  useCurrentTrack,
  usePlaybackProgress,
  usePlaybackState,
  usePlayerControls,
  useVolumeControl,
} from '@/player'
import { AudioPlayer } from '@/shared/components'
import { AudioPlayerSkeleton } from '@/shared/components/Skeleton/AudioPlayerSkeleton.tsx'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

import s from './Player.module.css'

const MOCK_TRACK = {
  src: 'https://cdn.uppbeat.io/audio-files/c636d7c86452449b1203fc0bded83e29/4358717fc9da477a52fb18a6cbd3afcc/d154b5ce5ff1a05ae8115a3c678062e8/STREAMING-dreamland-matrika-main-version-31140-02-25.mp3',
  cover: 'https://unsplash.it/112/112',
  title: 'Play It Safe',
  artist: 'Julia Wolf',
}

export const Player = () => {
  const isLoadingTrack = useAppSelector(selectIsLoadingTrack)
  const { track: currentTrack } = useCurrentTrack()
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const { isPlaying } = usePlaybackState()
  const { seek, pause, resume, next, previous } = usePlayerControls()
  const { currentTime, duration } = usePlaybackProgress()
  const { volume, setVolume } = useVolumeControl()

  const handleNextTrack = () => {
    next()
  }

  const handlePreviousTrack = () => {
    previous()
  }

  const handleTogglePlay = () => {
    if (isPlaying) {
      pause()
    } else {
      resume()
    }
  }

  return isLoadingTrack ? (
    <AudioPlayerSkeleton />
  ) : (
    <AudioPlayer
      cover={currentTrack?.albumArt || MOCK_TRACK.cover}
      title={currentTrack?.title || MOCK_TRACK.title}
      artist={currentTrack?.artist || MOCK_TRACK.artist}
      isPlaying={isPlaying}
      onNext={handleNextTrack}
      onPrevious={handlePreviousTrack}
      onTogglePlay={handleTogglePlay}
      isShuffle={isShuffle}
      isRepeat={isRepeat}
      onShuffle={() => setIsShuffle(!isShuffle)}
      onRepeat={() => setIsRepeat(!isRepeat)}
      className={s.player}
      duration={duration}
      currentTime={currentTime}
      volume={volume}
      onTimeSeek={seek}
      onVolumeSet={setVolume}
    />
  )
}
