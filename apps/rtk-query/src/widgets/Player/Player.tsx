import { usePlaybackState, usePlayerControls } from '@/player'
import { useState } from 'react'

import { AudioPlayer } from '@/shared/components'

import s from './Player.module.css'
import { useParams } from 'react-router'
import { useFetchTrackByIdQuery } from '@/features/tracks'

const MOCK_TRACK = {
  src: 'https://cdn.uppbeat.io/audio-files/c636d7c86452449b1203fc0bded83e29/4358717fc9da477a52fb18a6cbd3afcc/d154b5ce5ff1a05ae8115a3c678062e8/STREAMING-dreamland-matrika-main-version-31140-02-25.mp3',
  cover: 'https://unsplash.it/112/112',
  title: 'Play It Safe',
  artist: 'Julia Wolf',
}

export const Player = () => {
  const { id } = useParams()
  const { data: track } = useFetchTrackByIdQuery({ trackId: id! })

  console.log(track)

  const { isPlaying } = usePlaybackState()
  const { togglePlayPause } = usePlayerControls()
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)

  return (
    <AudioPlayer
      {...MOCK_TRACK}
      src={track?.data.attributes.attachments[0]?.url || MOCK_TRACK.src}
      isPlaying={isPlaying}
      setIsPlaying={togglePlayPause}
      onNext={() => {}}
      onPrevious={() => {}}
      isShuffle={isShuffle}
      isRepeat={isRepeat}
      onShuffle={() => setIsShuffle(!isShuffle)}
      onRepeat={() => setIsRepeat(!isRepeat)}
      className={s.player}
      title={track?.data.attributes.title || MOCK_TRACK.title}
      artist={track?.data.attributes.artists[0]?.name || MOCK_TRACK.artist}
    />
  )
}
