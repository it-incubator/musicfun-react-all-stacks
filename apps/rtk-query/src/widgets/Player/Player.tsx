import { useTranslation } from 'react-i18next'

import { useFetchTracksQuery } from '@/features/tracks'
import {
  useCurrentTrack,
  usePlaybackModes,
  usePlaybackProgress,
  usePlaybackState,
  usePlayerControls,
  useVolumeControl,
} from '@/player'
import {
  convertApiTracksToPlayerTracks,
  convertApiTrackToPlayerTrack,
} from '@/player/utils/convert-api-track-to-player-track.ts'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { AudioPlayer } from '@/shared/components'
import { AudioPlayerSkeleton } from '@/shared/components/AudioPlayer/AudioPlayerSceleton/AudioPlayerSkeleton.tsx'

import s from './Player.module.css'

export const Player = () => {
  const { t } = useTranslation()
  const { track: currentTrack } = useCurrentTrack()
  const { shuffleMode, repeatMode, setRepeatMode, toggleShuffle } = usePlaybackModes()
  const { isPlaying } = usePlaybackState()
  const { seek, pause, resume, next, previous, play } = usePlayerControls()
  const { currentTime, duration } = usePlaybackProgress()
  const { volume, setVolume } = useVolumeControl()

  const { data: tracks, isLoading: isApiTracksLoading } = useFetchTracksQuery({
    pageSize: 10,
    pageNumber: 1,
  })

  const firstTrack = tracks?.data[0]
  const playerTrack = firstTrack ? convertApiTrackToPlayerTrack(firstTrack) : null
  const allPlayerTracks = tracks?.data ? convertApiTracksToPlayerTracks(tracks.data) : []
  const cover = firstTrack?.attributes.images.main[1]?.url // if you use 0 - image is blurred, if you use 1 - image is clear
  const title = firstTrack?.attributes.title
  const artistName = playerTrack?.artist || t('player.unknown_artist')

  const handleNextTrack = () => {
    next()
  }
  const handlePreviousTrack = () => {
    previous()
  }
  const handleTogglePlay = () => {
    if (currentTrack) {
      return isPlaying ? pause() : resume()
    }

    if (firstTrack && allPlayerTracks.length > 0) {
      return play(playerTrack!, undefined, allPlayerTracks)
    }

    return undefined
  }
  const handleToggleShuffle = () => {
    toggleShuffle()
  }
  const handleSetRepeatMode = () => {
    setRepeatMode()
  }

  return isApiTracksLoading ? (
    <AudioPlayerSkeleton />
  ) : (
    <AudioPlayer
      cover={currentTrack?.albumArt || (currentTrack ? noCoverPlaceholder : cover!)}
      title={currentTrack?.title || title!}
      artist={currentTrack?.artist || artistName}
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
