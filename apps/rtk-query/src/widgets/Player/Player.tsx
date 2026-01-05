import { useFetchTracksQuery } from '@/features/tracks'
import {
  selectIsLoadingTrack,
  useCurrentTrack,
  usePlaybackModes,
  usePlaybackProgress,
  usePlaybackState,
  usePlayerControls,
  useVolumeControl,
} from '@/player'
import { convertApiTrackToPlayerTrack } from '@/player/utils'
import { AudioPlayer } from '@/shared/components'
import { AudioPlayerSkeleton } from '@/shared/components/Skeleton/AudioPlayerSkeleton.tsx'
import { useAppSelector } from '@/shared/hooks'

import s from './Player.module.css'

export const Player = () => {
  const isLoadingTrack = useAppSelector(selectIsLoadingTrack)
  const { track: currentTrack } = useCurrentTrack()
  const { shuffleMode, repeatMode, setRepeatMode, toggleShuffle } = usePlaybackModes()
  const { isPlaying } = usePlaybackState()
  const { seek, pause, resume, next, previous, play } = usePlayerControls()
  const { currentTime, duration } = usePlaybackProgress()
  const { volume, setVolume } = useVolumeControl()

  const { data: tracks } = useFetchTracksQuery({
    pageSize: 10,
    pageNumber: 1,
  })

  const handleNextTrack = () => {
    next()
  }
  const handlePreviousTrack = () => {
    previous()
  }
  const handleTogglePlay = () => {
    if (currentTrack) {
      // If there's a current track in the player, play it
      if (isPlaying) {
        pause()
      } else {
        resume()
      }
    } else if (tracks?.data && tracks.data.length > 0) {
      // If no current track, play the first track from the API
      const firstTrack = tracks.data[0]
      const playerTrack = convertApiTrackToPlayerTrack(firstTrack)
      const allPlayerTracks = tracks.data.map(convertApiTrackToPlayerTrack)
      play(playerTrack, undefined, allPlayerTracks)
    }
  }
  const handleToggleShuffle = () => {
    toggleShuffle()
  }
  const handleSetRepeatMode = () => {
    setRepeatMode()
  }
  const cover = tracks?.data[0].attributes.images.main[1].url
  const title = tracks?.data[0].attributes.title
  // We'll get artist info through the converted track object
  const firstTrackForDisplay = tracks?.data[0] ? convertApiTrackToPlayerTrack(tracks.data[0]) : null
  const artist = firstTrackForDisplay?.artist || 'Unknown Artist'

  return isLoadingTrack ? (
    <AudioPlayerSkeleton />
  ) : (
    <AudioPlayer
      cover={currentTrack?.albumArt || cover!}
      title={currentTrack?.title || title!}
      artist={currentTrack?.artist || artist}
      isPlaying={isPlaying}
      onNext={handleNextTrack}
      onPrevious={handlePreviousTrack}
      onTogglePlay={handleTogglePlay}
      isShuffle={shuffleMode}
      isRepeat={repeatMode}
      onShuffle={handleToggleShuffle}
      onRepeat={handleSetRepeatMode}
      className={s.player}
      duration={duration}
      currentTime={currentTime}
      volume={volume}
      onTimeSeek={seek}
      onVolumeSet={setVolume}
    />
  )
}
