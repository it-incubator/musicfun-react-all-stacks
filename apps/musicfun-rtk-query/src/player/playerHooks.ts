import { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store/store'
import {
  makeSelectTrackPlaybackState,
  makeSelectTrackProgress,
  makeSelectIsCurrentTrack,
  makeSelectTrackQueuePosition,
  selectIsPlaying,
  selectIsPaused,
  selectCurrentTrackId,
  selectPlaybackState,
  selectCurrentTime,
  selectDuration,
  selectProgress,
  selectVolume,
  selectIsMuted,
  selectRepeatMode,
  selectShuffleMode,
  selectQueue,
  selectQueueIndex,
  selectHasNextTrack,
  selectHasPreviousTrack,
  selectError,
  selectIsLoading,
  selectFormattedTime,
  selectCurrentTrack,
  selectQueueTracks,
  selectEffectiveVolume,
  selectVolumePercentage,
  selectQueuePosition,
  selectNextTrackId,
  selectPreviousTrackId,
  selectPlaybackModeDescription,
} from './playerSelectors'
import {
  playTrack,
  pause,
  resume,
  stop,
  togglePlayPause,
  nextTrack,
  previousTrack,
  playTrackAtIndex,
  seek,
  setVolume,
  toggleMute,
  setRepeatMode,
  toggleShuffle,
  loadPlaylist,
  addToQueue,
  insertNext,
  removeFromQueue,
  clearQueue,
} from './playerSlice'
import type { RepeatMode, TrackPlaybackState, TrackProgress, Track } from './types/player.types'

// ========================================
// Playback Control Hooks
// ========================================

/**
 * Hook for controlling playback (play, pause, stop, etc.)
 */
export function usePlayerControls() {
  const dispatch = useDispatch<AppDispatch>()

  return useMemo(
    () => ({
      play: (track: Track, playlistId?: string, tracks?: Track[]) =>
        dispatch(playTrack({ track, playlistId, tracks })),
      pause: () => dispatch(pause()),
      resume: () => dispatch(resume()),
      stop: () => dispatch(stop()),
      togglePlayPause: () => dispatch(togglePlayPause()),
      next: () => dispatch(nextTrack()),
      previous: () => dispatch(previousTrack()),
      playAtIndex: (index: number) => dispatch(playTrackAtIndex(index)),
      seek: (time: number) => dispatch(seek(time)),
    }),
    [dispatch]
  )
}

/**
 * Hook for playback state information
 */
export function usePlaybackState() {
  const isPlaying = useSelector(selectIsPlaying)
  const isPaused = useSelector(selectIsPaused)
  const isLoading = useSelector(selectIsLoading)
  const playbackState = useSelector(selectPlaybackState)
  const error = useSelector(selectError)

  return {
    isPlaying,
    isPaused,
    isLoading,
    playbackState,
    error,
  }
}

/**
 * Hook for current track information
 */
export function useCurrentTrack() {
  const trackId = useSelector(selectCurrentTrackId)
  const track = useSelector(selectCurrentTrack)
  const isPlaying = useSelector(selectIsPlaying)
  const isPaused = useSelector(selectIsPaused)

  return {
    trackId,
    track,
    isPlaying,
    isPaused,
  }
}

/**
 * Hook for playback progress
 */
export function usePlaybackProgress() {
  const currentTime = useSelector(selectCurrentTime)
  const duration = useSelector(selectDuration)
  const progress = useSelector(selectProgress)
  const formattedTime = useSelector(selectFormattedTime)

  return {
    currentTime,
    duration,
    progress,
    formattedTime,
  }
}

// ========================================
// Track-Specific Hooks (Performance Optimized)
// ========================================

/**
 * Hook for track-specific playback state
 * Only causes rerender when THIS track's state changes
 *
 * Usage in track component:
 * ```tsx
 * const { isPlaying, isPaused } = useTrackPlaybackState(track.id);
 * ```
 */
export function useTrackPlaybackState(trackId: string): TrackPlaybackState {
  const selectTrackState = useMemo(makeSelectTrackPlaybackState, [])
  return useSelector((state: RootState) => selectTrackState(state, trackId))
}

/**
 * Hook for track-specific progress
 * Only returns progress data if this is the current track
 *
 * Usage in track component:
 * ```tsx
 * const { progress, currentTime } = useTrackProgress(track.id);
 * ```
 */
export function useTrackProgress(trackId: string): TrackProgress {
  const selectProgress = useMemo(makeSelectTrackProgress, [])
  return useSelector((state: RootState) => selectProgress(state, trackId))
}

/**
 * Hook to check if a track is the current track
 */
export function useIsCurrentTrack(trackId: string): boolean {
  const selectIsCurrentTrack = useMemo(makeSelectIsCurrentTrack, [])
  return useSelector((state: RootState) => selectIsCurrentTrack(state, trackId))
}

/**
 * Hook to get track's position in queue (null if not in queue)
 */
export function useTrackQueuePosition(trackId: string): number | null {
  const selectPosition = useMemo(makeSelectTrackQueuePosition, [])
  return useSelector((state: RootState) => selectPosition(state, trackId))
}

/**
 * Combined hook for track playback controls
 * Provides both state and control functions for a specific track
 */
export function useTrackPlayer(track: Track) {
  const dispatch = useDispatch<AppDispatch>()
  const { isPlaying, isPaused, isCurrentTrack } = useTrackPlaybackState(track.id)
  const { progress, currentTime } = useTrackProgress(track.id)
  const queuePosition = useTrackQueuePosition(track.id)

  const play = useCallback(() => {
    dispatch(playTrack({ track }))
  }, [dispatch, track])

  const pauseTrack = useCallback(() => {
    dispatch(pause())
  }, [dispatch])

  const resumeTrack = useCallback(() => {
    dispatch(resume())
  }, [dispatch])

  const togglePlayPauseTrack = useCallback(() => {
    if (isPlaying) {
      dispatch(pause())
    } else if (isPaused) {
      dispatch(resume())
    } else {
      dispatch(playTrack({ track }))
    }
  }, [dispatch, track, isPlaying, isPaused])

  return {
    // State
    isPlaying,
    isPaused,
    isCurrentTrack,
    progress,
    currentTime,
    queuePosition,
    // Actions
    play,
    pause: pauseTrack,
    resume: resumeTrack,
    togglePlayPause: togglePlayPauseTrack,
  }
}

// ========================================
// Volume Control Hooks
// ========================================

/**
 * Hook for volume control
 */
export function useVolumeControl() {
  const dispatch = useDispatch<AppDispatch>()
  const volume = useSelector(selectVolume)
  const isMuted = useSelector(selectIsMuted)
  const effectiveVolume = useSelector(selectEffectiveVolume)
  const volumePercentage = useSelector(selectVolumePercentage)

  const setVolumeValue = useCallback(
    (value: number) => {
      dispatch(setVolume(value))
    },
    [dispatch]
  )

  const toggleMuteValue = useCallback(() => {
    dispatch(toggleMute())
  }, [dispatch])

  return {
    volume,
    isMuted,
    effectiveVolume,
    volumePercentage,
    setVolume: setVolumeValue,
    toggleMute: toggleMuteValue,
  }
}

// ========================================
// Queue Management Hooks
// ========================================

/**
 * Hook for queue state
 */
export function useQueue() {
  const queue = useSelector(selectQueue)
  const queueIndex = useSelector(selectQueueIndex)
  const queueTracks = useSelector(selectQueueTracks)
  const queuePosition = useSelector(selectQueuePosition)
  const hasNext = useSelector(selectHasNextTrack)
  const hasPrevious = useSelector(selectHasPreviousTrack)
  const nextTrackId = useSelector(selectNextTrackId)
  const previousTrackId = useSelector(selectPreviousTrackId)

  return {
    queue,
    queueIndex,
    queueTracks,
    queuePosition,
    hasNext,
    hasPrevious,
    nextTrackId,
    previousTrackId,
  }
}

/**
 * Hook for queue manipulation
 */
export function useQueueControls() {
  const dispatch = useDispatch<AppDispatch>()

  return useMemo(
    () => ({
      loadPlaylist: (playlistId: string, tracks: Track[], startIndex?: number) =>
        dispatch(loadPlaylist({ playlistId, tracks, startIndex })),
      addToQueue: (tracks: Track[]) => dispatch(addToQueue(tracks)),
      insertNext: (track: Track) => dispatch(insertNext(track)),
      removeFromQueue: (index: number) => dispatch(removeFromQueue(index)),
      clearQueue: () => dispatch(clearQueue()),
    }),
    [dispatch]
  )
}

/**
 * Combined hook for queue state and controls
 */
export function usePlayerQueue() {
  const queueState = useQueue()
  const queueControls = useQueueControls()

  return {
    ...queueState,
    ...queueControls,
  }
}

// ========================================
// Playback Mode Hooks
// ========================================

/**
 * Hook for playback modes (repeat, shuffle)
 */
export function usePlaybackModes() {
  const dispatch = useDispatch<AppDispatch>()
  const repeatMode = useSelector(selectRepeatMode)
  const shuffleMode = useSelector(selectShuffleMode)
  const modeDescription = useSelector(selectPlaybackModeDescription)

  const setRepeatModeValue = useCallback(
    (mode: RepeatMode) => {
      dispatch(setRepeatMode(mode))
    },
    [dispatch]
  )

  const toggleShuffleValue = useCallback(() => {
    dispatch(toggleShuffle())
  }, [dispatch])

  const cycleRepeatMode = useCallback(() => {
    const nextMode: RepeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
    dispatch(setRepeatMode(nextMode))
  }, [dispatch, repeatMode])

  return {
    repeatMode,
    shuffleMode,
    modeDescription,
    setRepeatMode: setRepeatModeValue,
    toggleShuffle: toggleShuffleValue,
    cycleRepeatMode,
  }
}

// ========================================
// Combined Player Hook
// ========================================

/**
 * All-in-one hook for complete player functionality
 * Use this if you need access to everything
 */
export function usePlayer() {
  const controls = usePlayerControls()
  const playbackState = usePlaybackState()
  const currentTrack = useCurrentTrack()
  const progress = usePlaybackProgress()
  const volume = useVolumeControl()
  const queue = usePlayerQueue()
  const modes = usePlaybackModes()

  return {
    controls,
    playbackState,
    currentTrack,
    progress,
    volume,
    queue,
    modes,
  }
}

// ========================================
// Navigation Hooks
// ========================================

/**
 * Hook for track navigation (next, previous)
 */
export function useTrackNavigation() {
  const dispatch = useDispatch<AppDispatch>()
  const hasNext = useSelector(selectHasNextTrack)
  const hasPrevious = useSelector(selectHasPreviousTrack)
  const nextTrackId = useSelector(selectNextTrackId)
  const previousTrackId = useSelector(selectPreviousTrackId)

  const goNext = useCallback(() => {
    dispatch(nextTrack())
  }, [dispatch])

  const goPrevious = useCallback(() => {
    dispatch(previousTrack())
  }, [dispatch])

  return {
    hasNext,
    hasPrevious,
    nextTrackId,
    previousTrackId,
    next: goNext,
    previous: goPrevious,
  }
}

// ========================================
// Keyboard Controls Hook
// ========================================

/**
 * Hook to enable keyboard shortcuts for player control
 * Call this in your main player component
 *
 * Shortcuts:
 * - Space: Play/Pause
 * - Arrow Right: Seek forward 5s
 * - Arrow Left: Seek backward 5s
 * - Arrow Up: Volume up
 * - Arrow Down: Volume down
 * - M: Toggle mute
 * - N: Next track
 * - P: Previous track
 */
export function usePlayerKeyboardControls(enabled = true) {
  const dispatch = useDispatch<AppDispatch>()
  const currentTime = useSelector(selectCurrentTime)
  const duration = useSelector(selectDuration)
  const volume = useSelector(selectVolume)

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          dispatch(togglePlayPause())
          break

        case 'arrowright':
          e.preventDefault()
          dispatch(seek(Math.min(currentTime + 5, duration)))
          break

        case 'arrowleft':
          e.preventDefault()
          dispatch(seek(Math.max(currentTime - 5, 0)))
          break

        case 'arrowup':
          e.preventDefault()
          dispatch(setVolume(Math.min(volume + 0.1, 1)))
          break

        case 'arrowdown':
          e.preventDefault()
          dispatch(setVolume(Math.max(volume - 0.1, 0)))
          break

        case 'm':
          e.preventDefault()
          dispatch(toggleMute())
          break

        case 'n':
          e.preventDefault()
          dispatch(nextTrack())
          break

        case 'p':
          e.preventDefault()
          dispatch(previousTrack())
          break
      }
    },
    [enabled, dispatch, currentTime, duration, volume]
  )

  // Set up keyboard event listener
  useMemo(() => {
    if (!enabled) return

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [enabled, handleKeyPress])
}

// ========================================
// Export all hooks
// ========================================

export default {
  usePlayer,
  usePlayerControls,
  usePlaybackState,
  useCurrentTrack,
  usePlaybackProgress,
  useTrackPlaybackState,
  useTrackProgress,
  useIsCurrentTrack,
  useTrackQueuePosition,
  useTrackPlayer,
  useVolumeControl,
  useQueue,
  useQueueControls,
  usePlayerQueue,
  usePlaybackModes,
  useTrackNavigation,
  usePlayerKeyboardControls,
}
