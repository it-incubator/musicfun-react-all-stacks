import { useCallback, useMemo } from 'react'
import type { RepeatMode, Track } from '../types/player.types'
import {
  useTrackPlaybackState,
  useTrackProgress,
  useIsCurrentTrack,
  useTrackQueuePosition,
} from './track-selectors'
import { formatTime } from '../utils'
import { usePlayerStore } from './player-store'

// ========================================
// Hooks that use reactive state (trigger re-renders)
// ========================================

export function usePlayingTrackProgress() {
  const currentTime = usePlayerStore((state) => state.currentTime)
  const duration = usePlayerStore((state) => state.duration)
  const playingTrackProgress = usePlayerStore((state) => {
    const { currentTime, duration } = state
    return duration > 0 ? (currentTime / duration) * 100 : 0
  })
  return { playingTrackProgress, currentTime, duration }
}

export function usePlaybackState() {
  const isPlaying = usePlayerStore((state) => state.playbackState === 'playing')
  const isPaused = usePlayerStore((state) => state.playbackState === 'paused')
  const isLoading = usePlayerStore((state) => state.playbackState === 'loading' || state.isLoadingTrack)
  const playbackState = usePlayerStore((state) => state.playbackState)
  const error = usePlayerStore((state) => state.error)

  return {
    isPlaying,
    isPaused,
    isLoading,
    playbackState,
    error,
  }
}

export function useCurrentTrack() {
  const trackId = usePlayerStore((state) => state.currentTrackId)
  const track = usePlayerStore((state) => 
    state.currentTrackId ? state.tracks[state.currentTrackId] || null : null
  )
  const isPlaying = usePlayerStore((state) => state.playbackState === 'playing')
  const isPaused = usePlayerStore((state) => state.playbackState === 'paused')

  return {
    trackId,
    track,
    isPlaying,
    isPaused,
  }
}

export function usePlaybackProgress() {
  const currentTime = usePlayerStore((state) => state.currentTime)
  const duration = usePlayerStore((state) => state.duration)
  const progress = usePlayerStore((state) => {
    const { currentTime, duration } = state
    if (!duration || duration === 0) return 0
    return (currentTime / duration) * 100
  })
  const formattedTime = usePlayerStore((state) => {
    const { currentTime, duration } = state
    return {
      current: formatTime(currentTime),
      duration: formatTime(duration),
    }
  })

  return {
    currentTime,
    duration,
    progress,
    formattedTime,
  }
}

export function useVolumeControl() {
  const volume = usePlayerStore((state) => state.volume)
  const isMuted = usePlayerStore((state) => state.isMuted)
  const effectiveVolume = usePlayerStore((state) => state.isMuted ? 0 : state.volume)
  const volumePercentage = usePlayerStore((state) => Math.round(state.volume * 100))

  return {
    volume,
    isMuted,
    effectiveVolume,
    volumePercentage,
  }
}

export function useQueue() {
  const queue = usePlayerStore((state) => state.queue)
  const queueIndex = usePlayerStore((state) => state.queueIndex)
  const queueTracks = usePlayerStore((state) => {
    if (!state.queue.length) return []
    return state.queue
      .map((trackId: string) => state.tracks[trackId])
      .filter((track): track is Track => track !== undefined)
  })
  const queuePosition = usePlayerStore((state) => {
    const { queueIndex, queue } = state
    return {
      current: queueIndex + 1,
      total: queue.length,
      isFirst: queueIndex === 0,
      isLast: queueIndex >= queue.length - 1,
    }
  })
  const hasNext = usePlayerStore((state) => state.hasNextTrack)
  const hasPrevious = usePlayerStore((state) => state.hasPreviousTrack)
  const nextTrackId = usePlayerStore((state) => {
    if (state.queue.length === 0) return null
    const isAtEnd = state.queueIndex >= state.queue.length - 1
    if (isAtEnd) {
      if (state.repeatMode === 'one') return state.queue[state.queueIndex]
      if (state.repeatMode === 'all') return state.queue[0]
      return null
    }
    return state.queue[state.queueIndex + 1]
  })
  const previousTrackId = usePlayerStore((state) => {
    if (state.queue.length === 0) return null
    const isAtBeginning = state.queueIndex <= 0
    if (isAtBeginning) {
      if (state.repeatMode === 'all') return state.queue[state.queue.length - 1]
      return state.queue[0]
    }
    return state.queue[state.queueIndex - 1]
  })

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

export function usePlaybackModes() {
  const repeatMode = usePlayerStore((state) => state.repeatMode)
  const shuffleMode = usePlayerStore((state) => state.shuffleMode)
  const modeDescription = usePlayerStore((state) => {
    const parts: string[] = []
    if (state.shuffleMode) parts.push('Shuffle')
    switch (state.repeatMode) {
      case 'one': parts.push('Repeat One'); break
      case 'all': parts.push('Repeat All'); break
      case 'off': parts.push('No Repeat'); break
    }
    return parts.join(', ')
  })

  return {
    repeatMode,
    shuffleMode,
    modeDescription,
  }
}

// ========================================
// Track-Specific Hooks (Performance Optimized)
// ========================================

/**
 * Hook for track-specific playback state
 * Only causes rerender when THIS track's state changes
 */
export function useTrackPlayer(track: Track) {
  const { isPlaying, isPaused, isCurrentTrack } = useTrackPlaybackState(track.id)
  const { progress, currentTime } = useTrackProgress(track.id)
  const queuePosition = useTrackQueuePosition(track.id)

  const play = useCallback(() => {
    usePlayerStore.getState().play(track)
  }, [track])

  const pauseTrack = useCallback(() => {
    usePlayerStore.getState().pause()
  }, [])

  const resumeTrack = useCallback(() => {
    usePlayerStore.getState().resume()
  }, [])

  const togglePlayPauseTrack = useCallback(() => {
    const store = usePlayerStore.getState()
    const state = store
    if (state.currentTrackId === track.id && state.playbackState === 'playing') {
      store.pause()
    } else if (state.currentTrackId === track.id && state.playbackState === 'paused') {
      store.resume()
    } else {
      store.play(track)
    }
  }, [track])

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
// Combined Hooks
// ========================================

export function usePlayerControls() {
  return useMemo(
    () => ({
      play: (track: Track, playlistId?: string, tracks?: Track[]) =>
        usePlayerStore.getState().play(track, playlistId, tracks),
      pause: () => usePlayerStore.getState().pause(),
      resume: () => usePlayerStore.getState().resume(),
      stop: () => usePlayerStore.getState().stop(),
      togglePlayPause: () => usePlayerStore.getState().togglePlayPause(),
      next: () => usePlayerStore.getState().nextTrack(),
      previous: () => usePlayerStore.getState().previousTrack(),
      playAtIndex: (index: number) => usePlayerStore.getState().playTrackAtIndex(index),
      seek: (time: number) => usePlayerStore.getState().seek(time),
    }),
    []
  )
}

export function useQueueControls() {
  return useMemo(
    () => ({
      loadPlaylist: (playlistId: string, tracks: Track[], startIndex?: number) =>
        usePlayerStore.getState().loadPlaylist(playlistId, tracks, startIndex),
      addToQueue: (tracks: Track[]) => usePlayerStore.getState().addToQueue(tracks),
      insertNext: (track: Track) => usePlayerStore.getState().insertNext(track),
      removeFromQueue: (index: number) => usePlayerStore.getState().removeFromQueue(index),
      clearQueue: () => usePlayerStore.getState().clearQueue(),
    }),
    []
  )
}

export function usePlayerQueue() {
  const queueState = useQueue()
  const queueControls = useQueueControls()

  return {
    ...queueState,
    ...queueControls,
  }
}

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

export function useTrackNavigation() {
  const hasNext = usePlayerStore((state) => state.hasNextTrack)
  const hasPrevious = usePlayerStore((state) => state.hasPreviousTrack)
  const nextTrackId = usePlayerStore((state) => {
    if (state.queue.length === 0) return null
    const isAtEnd = state.queueIndex >= state.queue.length - 1
    if (isAtEnd) {
      if (state.repeatMode === 'one') return state.queue[state.queueIndex]
      if (state.repeatMode === 'all') return state.queue[0]
      return null
    }
    return state.queue[state.queueIndex + 1]
  })
  const previousTrackId = usePlayerStore((state) => {
    if (state.queue.length === 0) return null
    const isAtBeginning = state.queueIndex <= 0
    if (isAtBeginning) {
      if (state.repeatMode === 'all') return state.queue[state.queue.length - 1]
      return state.queue[0]
    }
    return state.queue[state.queueIndex - 1]
  })

  const goNext = useCallback(() => {
    usePlayerStore.getState().nextTrack()
  }, [])

  const goPrevious = useCallback(() => {
    usePlayerStore.getState().previousTrack()
  }, [])

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
// Mode Control Hooks
// ========================================

export function useSetRepeatMode() {
  return useCallback(
    (mode: RepeatMode) => {
      usePlayerStore.getState().setRepeatMode(mode)
    },
    []
  )
}

export function useCycleRepeatMode() {
  const repeatMode = usePlayerStore((state) => state.repeatMode)

  return useCallback(() => {
    const nextMode: RepeatMode =
      repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
    usePlayerStore.getState().setRepeatMode(nextMode)
  }, [repeatMode])
}

export function useToggleShuffle() {
  return useCallback(() => {
    usePlayerStore.getState().toggleShuffle()
  }, [])
}

// ========================================
// Keyboard Controls Hook
// ========================================

export function usePlayerKeyboardControls(enabled = true) {
  const currentTime = usePlayerStore((state) => state.currentTime)
  const duration = usePlayerStore((state) => state.duration)
  const volume = usePlayerStore((state) => state.volume)

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const store = usePlayerStore.getState()
      const state = store

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          store.togglePlayPause()
          break

        case 'arrowright':
          e.preventDefault()
          store.seek(Math.min(state.currentTime + 5, state.duration))
          break

        case 'arrowleft':
          e.preventDefault()
          store.seek(Math.max(state.currentTime - 5, 0))
          break

        case 'arrowup':
          e.preventDefault()
          store.setVolume(Math.min(state.volume + 0.1, 1))
          break

        case 'arrowdown':
          e.preventDefault()
          store.setVolume(Math.max(state.volume - 0.1, 0))
          break

        case 'm':
          e.preventDefault()
          store.toggleMute()
          break

        case 'n':
          e.preventDefault()
          store.nextTrack()
          break

        case 'p':
          e.preventDefault()
          store.previousTrack()
          break
      }
    },
    [enabled, currentTime, duration, volume]
  )

  // Set up keyboard event listener
  useMemo(() => {
    if (typeof window === 'undefined') return

    if (enabled) {
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
  usePlayingTrackProgress,
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
  useSetRepeatMode,
  useCycleRepeatMode,
  useToggleShuffle,
  usePlayerKeyboardControls,
}
