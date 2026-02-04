import { usePlayerStore } from './player-store'
import type { TrackPlaybackState, TrackProgress } from '../types/player.types'

/**
 * Hook that returns playback state for a specific track
 * This ensures only the specific track component rerenders when its state changes
 *
 * Usage:
 * ```tsx
 * const trackState = useTrackPlaybackState(trackId)
 * ```
 */
export function useTrackPlaybackState(trackId: string): TrackPlaybackState {
  return usePlayerStore((state) => ({
    isCurrentTrack: state.currentTrackId === trackId,
    isPlaying: state.currentTrackId === trackId && state.playbackState === 'playing',
    isPaused: state.currentTrackId === trackId && state.playbackState === 'paused',
    playbackState: state.currentTrackId === trackId ? state.playbackState : ('idle' as const),
  }))
}

/**
 * Hook that returns progress for a specific track
 * Only returns progress data if this is the current track
 *
 * Usage:
 * ```tsx
 * const progress = useTrackProgress(trackId)
 * ```
 */
export function useTrackProgress(trackId: string): TrackProgress {
  return usePlayerStore((state) => {
    if (state.currentTrackId !== trackId) {
      return { progress: 0, currentTime: 0 }
    }
    return {
      progress: state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0,
      currentTime: state.currentTime,
    }
  })
}

/**
 * Returns whether a specific track is the current track
 */
export function useIsCurrentTrack(trackId: string): boolean {
  return usePlayerStore((state) => state.currentTrackId === trackId)
}

/**
 * Returns the position of a track in the queue
 */
export function useTrackQueuePosition(trackId: string): number | null {
  return usePlayerStore((state) => {
    const index = state.queue.indexOf(trackId)
    return index === -1 ? null : index
  })
}

/**
 * Check if track is in queue
 */
export function useIsTrackInQueue(trackId: string): boolean {
  return usePlayerStore((state) => state.queue.includes(trackId))
}
