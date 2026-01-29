import { usePlayerStore } from './player-store'
import type { FormattedTime, Track, TrackPlaybackState, TrackProgress } from '../types/player.types'
import { formatTime } from '../utils'

// ========================================
// Basic Selectors
// ========================================

export const selectPlayerState = () => usePlayerStore.getState()

export const selectCurrentTrackId = () => usePlayerStore.getState().currentTrackId

export const selectCurrentPlaylistId = () => usePlayerStore.getState().currentPlaylistId

export const selectPlaybackState = () => usePlayerStore.getState().playbackState

export const selectCurrentTime = () => usePlayerStore.getState().currentTime

export const selectDuration = () => usePlayerStore.getState().duration

export const selectBuffered = () => usePlayerStore.getState().buffered

export const selectVolume = () => usePlayerStore.getState().volume

export const selectIsMuted = () => usePlayerStore.getState().isMuted

export const selectRepeatMode = () => usePlayerStore.getState().repeatMode

export const selectShuffleMode = () => usePlayerStore.getState().shuffleMode

export const selectQueue = () => usePlayerStore.getState().queue

export const selectOriginalQueue = () => usePlayerStore.getState().originalQueue

export const selectQueueIndex = () => usePlayerStore.getState().queueIndex

export const selectError = () => usePlayerStore.getState().error

export const selectIsLoadingTrack = () => usePlayerStore.getState().isLoadingTrack

export const selectHasNextTrack = () => usePlayerStore.getState().hasNextTrack

export const selectHasPreviousTrack = () => usePlayerStore.getState().hasPreviousTrack

export const selectTracks = () => usePlayerStore.getState().tracks

// ========================================
// Computed Selectors
// ========================================

export const selectIsPlaying = () => usePlayerStore.getState().playbackState === 'playing'

export const selectIsPaused = () => usePlayerStore.getState().playbackState === 'paused'

export const selectIsLoading = () => {
  const state = usePlayerStore.getState()
  return state.playbackState === 'loading' || state.isLoadingTrack
}

export const selectHasError = () => {
  const state = usePlayerStore.getState()
  return state.playbackState === 'error' || state.error !== null
}

export const selectProgress = () => {
  const currentTime = usePlayerStore.getState().currentTime
  const duration = usePlayerStore.getState().duration
  if (!duration || duration === 0) return 0
  return (currentTime / duration) * 100
}

export const selectFormattedTime = (): FormattedTime => {
  const currentTime = usePlayerStore.getState().currentTime
  const duration = usePlayerStore.getState().duration
  return {
    current: formatTime(currentTime),
    duration: formatTime(duration),
  }
}

export const selectCurrentTrack = () => {
  const state = usePlayerStore.getState()
  if (!state.currentTrackId) return null
  return state.tracks[state.currentTrackId] || null
}

export const selectQueueTracks = () => {
  const state = usePlayerStore.getState()
  if (!state.queue.length) return []
  return state.queue
    .map((trackId: string) => state.tracks[trackId])
    .filter((track): track is Track => track !== undefined)
}

export const selectQueueTrackIds = () => usePlayerStore.getState().queue

export const selectQueueLength = () => usePlayerStore.getState().queue.length

// ========================================
// Volume & Controls Selectors
// ========================================

export const selectEffectiveVolume = () => {
  const volume = usePlayerStore.getState().volume
  const isMuted = usePlayerStore.getState().isMuted
  return isMuted ? 0 : volume
}

export const selectVolumePercentage = () => {
  return Math.round(usePlayerStore.getState().volume * 100)
}

// ========================================
// Queue Information Selectors
// ========================================

export const selectQueuePosition = () => {
  const queueIndex = usePlayerStore.getState().queueIndex
  const length = usePlayerStore.getState().queue.length
  return {
    current: queueIndex + 1,
    total: length,
    isFirst: queueIndex === 0,
    isLast: queueIndex >= length - 1,
  }
}

export const selectNextTrackId = () => {
  const state = usePlayerStore.getState()
  if (state.queue.length === 0) return null

  const isAtEnd = state.queueIndex >= state.queue.length - 1

  if (isAtEnd) {
    if (state.repeatMode === 'one') {
      return state.queue[state.queueIndex]
    } else if (state.repeatMode === 'all') {
      return state.queue[0]
    } else {
      return null
    }
  }

  return state.queue[state.queueIndex + 1]
}

export const selectPreviousTrackId = () => {
  const state = usePlayerStore.getState()
  if (state.queue.length === 0) return null

  const isAtBeginning = state.queueIndex <= 0

  if (isAtBeginning) {
    if (state.repeatMode === 'all') {
      return state.queue[state.queue.length - 1]
    } else {
      return state.queue[0]
    }
  }

  return state.queue[state.queueIndex - 1]
}

// ========================================
// Playback Mode Indicators
// ========================================

export const selectPlaybackModeDescription = () => {
  const repeatMode = usePlayerStore.getState().repeatMode
  const shuffleMode = usePlayerStore.getState().shuffleMode

  const parts: string[] = []

  if (shuffleMode) parts.push('Shuffle')

  switch (repeatMode) {
    case 'one':
      parts.push('Repeat One')
      break
    case 'all':
      parts.push('Repeat All')
      break
    case 'off':
      parts.push('No Repeat')
      break
  }

  return parts.join(', ')
}