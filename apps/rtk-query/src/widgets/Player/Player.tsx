import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useFetchTrackByIdQuery } from '@/features/tracks'
import type { Track } from '@/player'
import {
  usePlaybackProgress,
  usePlaybackState,
  usePlayerControls,
  useVolumeControl,
} from '@/player'
import { AudioPlayer } from '@/shared/components'

import s from './Player.module.css'

const MOCK_TRACK = {
  src: 'https://cdn.uppbeat.io/audio-files/c636d7c86452449b1203fc0bded83e29/4358717fc9da477a52fb18a6cbd3afcc/d154b5ce5ff1a05ae8115a3c678062e8/STREAMING-dreamland-matrika-main-version-31140-02-25.mp3',
  cover: 'https://unsplash.it/112/112',
  title: 'Play It Safe',
  artist: 'Julia Wolf',
}

export const Player = () => {
  const { id } = useParams()
  const { data: trackResponse, isLoading } = useFetchTrackByIdQuery({ trackId: id! })

  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const { isPlaying } = usePlaybackState()
  const { seek } = usePlayerControls()
  const { currentTime, duration } = usePlaybackProgress()
  const { volume, setVolume } = useVolumeControl()

  const { pause, resume } = usePlayerControls()

  const track: Track | undefined = trackResponse?.data
    ? {
        id: trackResponse.data.id,
        title: trackResponse.data.attributes.title,
        artist: trackResponse.data.attributes.artists[0]?.name || 'Unknown Artist',
        duration: trackResponse.data.attributes.duration,
        url: trackResponse.data.attributes.attachments[0]?.url || '',
        albumArt: trackResponse.data.attributes.images?.main?.[0]?.url,
      }
    : undefined

  if (isLoading) {
    return <div className={s.player}>Loading...</div>
  }

  const onTogglePlay = () => {
    // debugger
    // If you uncomment it, it won't work because track === undefined.
    // if (currentTrack && currentTrack.id === track?.id) {
    if (isPlaying) {
      pause()
    } else {
      resume()
    }
    // } else {
    //   play(track)
    // }
  }

  return (
    <AudioPlayer
      cover={track?.albumArt || MOCK_TRACK.cover}
      title={track?.title || MOCK_TRACK.title}
      artist={track?.artist || MOCK_TRACK.artist}
      isPlaying={isPlaying}
      onNext={() => {}}
      onPrevious={() => {}}
      onTogglePlay={onTogglePlay}
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
