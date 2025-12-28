import { useState } from 'react'

import { useLazyFetchTrackByIdQuery } from '@/features/tracks'
import { type Track, useCurrentTrack } from '@/player'
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
  const [fetchTrack, { isLoading }] = useLazyFetchTrackByIdQuery()
  const { track: currentTrack } = useCurrentTrack()
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const { isPlaying } = usePlaybackState()
  const { seek, pause, resume, play } = usePlayerControls()
  const { currentTime, duration } = usePlaybackProgress()
  const { volume, setVolume } = useVolumeControl()

  const fetchLazyTrack = async (trackToPlay: Track) => {
    if (currentTrack && currentTrack.id === trackToPlay.id) {
      if (isPlaying) {
        pause()
      } else {
        resume()
      }
      return
    }

    try {
      const result = await fetchTrack({ trackId: trackToPlay.id }).unwrap()

      if (result.data) {
        const fullTrackData: Track = {
          id: result.data.id,
          title: result.data.attributes.title,
          artist: result.data.attributes.artists[0]?.name || 'Unknown Artist',
          duration: result.data.attributes.duration,
          url: result.data.attributes.attachments[0]?.url || '',
          albumArt: result.data.attributes.images?.main?.[0]?.url,
        }
        play(fullTrackData)
      }
    } catch (error) {
      console.error('Failed to fetch track:', error)
      // Error handling can be added, for example, to display a notification.
    }
  }

  if (isLoading) {
    return <div className={s.player}>Loading...</div>
  }

  return (
    <AudioPlayer
      cover={currentTrack?.albumArt || MOCK_TRACK.cover}
      title={currentTrack?.title || MOCK_TRACK.title}
      artist={currentTrack?.artist || MOCK_TRACK.artist}
      isPlaying={isPlaying}
      onNext={() => {}}
      onPrevious={() => {}}
      onTogglePlay={() => currentTrack && fetchLazyTrack(currentTrack)}
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
