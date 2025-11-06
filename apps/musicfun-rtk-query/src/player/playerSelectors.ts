import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/store'
import type { TrackPlaybackState, TrackProgress, FormattedTime } from './types/player.types'
import { formatTime } from './utils'

// ========================================
// Basic Selectors
// ========================================

export const selectPlayerState = (state: RootState) => state.player

export const selectCurrentTrackId = (state: RootState) => state.player.currentTrackId

export const selectCurrentPlaylistId = (state: RootState) => state.player.currentPlaylistId

export const selectPlaybackState = (state: RootState) => state.player.playbackState

export const selectCurrentTime = (state: RootState) => state.player.currentTime

export const selectDuration = (state: RootState) => state.player.duration

export const selectBuffered = (state: RootState) => state.player.buffered

export const selectVolume = (state: RootState) => state.player.volume

export const selectIsMuted = (state: RootState) => state.player.isMuted

export const selectRepeatMode = (state: RootState) => state.player.repeatMode

export const selectShuffleMode = (state: RootState) => state.player.shuffleMode

export const selectQueue = (state: RootState) => state.player.queue

export const selectOriginalQueue = (state: RootState) => state.player.originalQueue

export const selectQueueIndex = (state: RootState) => state.player.queueIndex

export const selectError = (state: RootState) => state.player.error

export const selectIsLoadingTrack = (state: RootState) => state.player.isLoadingTrack

export const selectHasNextTrack = (state: RootState) => state.player.hasNextTrack

export const selectHasPreviousTrack = (state: RootState) => state.player.hasPreviousTrack

// ========================================
// Computed Selectors (Memoized)
// ========================================

/**
 * Returns true if currently playing
 */
export const selectIsPlaying = createSelector(
  [selectPlaybackState],
  (playbackState) => playbackState === 'playing'
)

/**
 * Returns true if currently paused
 */
export const selectIsPaused = createSelector(
  [selectPlaybackState],
  (playbackState) => playbackState === 'paused'
)

/**
 * Returns true if in loading state
 */
export const selectIsLoading = createSelector(
  [selectPlaybackState, selectIsLoadingTrack],
  (playbackState, isLoadingTrack) => playbackState === 'loading' || isLoadingTrack
)

/**
 * Returns true if in error state
 */
export const selectHasError = createSelector(
  [selectPlaybackState, selectError],
  (playbackState, error) => playbackState === 'error' || error !== null
)

/**
 * Returns playback progress as percentage (0-100)
 */
export const selectProgress = createSelector(
  [selectCurrentTime, selectDuration],
  (currentTime, duration) => {
    if (!duration || duration === 0) return 0
    return (currentTime / duration) * 100
  }
)

/**
 * Returns formatted time strings
 */
export const selectFormattedTime = createSelector(
  [selectCurrentTime, selectDuration],
  (currentTime, duration): FormattedTime => ({
    current: formatTime(currentTime),
    duration: formatTime(duration),
  })
)

/**
 * Returns the current track from player state
 */
export const selectCurrentTrack = createSelector(
  [selectCurrentTrackId, (state: RootState) => state.player.tracks],
  (trackId, tracks) => {
    if (!trackId) return null
    return tracks[trackId] || null
  }
)

/**
 * Returns array of track objects from the queue
 */
export const selectQueueTracks = createSelector(
  [selectQueue, (state: RootState) => state.player.tracks],
  (queue, tracks) => {
    if (!queue.length) return []

    return queue.map((trackId) => tracks[trackId]).filter((track) => track !== undefined)
  }
)

/**
 * Returns just the track IDs from the queue (for list rendering)
 */
export const selectQueueTrackIds = createSelector([selectQueue], (queue) => queue)

/**
 * Returns the number of tracks in queue
 */
export const selectQueueLength = createSelector([selectQueue], (queue) => queue.length)

/**
 * Returns whether a track is in the queue
 */
export const makeSelectIsTrackInQueue = () =>
  createSelector([selectQueue, (state: RootState, trackId: string) => trackId], (queue, trackId) =>
    queue.includes(trackId)
  )

// ========================================
// Track-Specific Selectors (Performance Critical)
// ========================================

/**
 * Factory function that creates a memoized selector for a specific track's playback state
 * This ensures only the specific track component rerenders when its state changes
 *
 * Usage:
 * ```
 * const selectTrackState = useMemo(makeSelectTrackPlaybackState, []);
 * const trackState = useSelector(state => selectTrackState(state, trackId));
 * ```
 */
export const makeSelectTrackPlaybackState = () =>
  createSelector(
    [selectCurrentTrackId, selectPlaybackState, (state: RootState, trackId: string) => trackId],
    (currentTrackId, playbackState, trackId): TrackPlaybackState => ({
      isCurrentTrack: currentTrackId === trackId,
      isPlaying: currentTrackId === trackId && playbackState === 'playing',
      isPaused: currentTrackId === trackId && playbackState === 'paused',
      playbackState: currentTrackId === trackId ? playbackState : 'idle',
    })
  )

/**
 * Factory function that creates a memoized selector for a specific track's progress
 * Only returns progress data if this is the current track
 *
 * Usage:
 * ```
 * const selectProgress = useMemo(makeSelectTrackProgress, []);
 * const progress = useSelector(state => selectProgress(state, trackId));
 * ```
 */
export const makeSelectTrackProgress = () =>
  createSelector(
    [
      selectCurrentTrackId,
      selectCurrentTime,
      selectDuration,
      (state: RootState, trackId: string) => trackId,
    ],
    (currentTrackId, currentTime, duration, trackId): TrackProgress => {
      if (currentTrackId !== trackId) {
        return { progress: 0, currentTime: 0 }
      }

      return {
        progress: duration > 0 ? (currentTime / duration) * 100 : 0,
        currentTime,
      }
    }
  )

/**
 * Returns whether a specific track is the current track
 */
export const makeSelectIsCurrentTrack = () =>
  createSelector(
    [selectCurrentTrackId, (state: RootState, trackId: string) => trackId],
    (currentTrackId, trackId) => currentTrackId === trackId
  )

/**
 * Returns the position of a track in the queue
 */
export const makeSelectTrackQueuePosition = () =>
  createSelector(
    [selectQueue, (state: RootState, trackId: string) => trackId],
    (queue, trackId) => {
      const index = queue.indexOf(trackId)
      return index === -1 ? null : index
    }
  )

// ========================================
// Volume & Controls Selectors
// ========================================

/**
 * Returns effective volume (0 if muted, otherwise actual volume)
 */
export const selectEffectiveVolume = createSelector(
  [selectVolume, selectIsMuted],
  (volume, isMuted) => (isMuted ? 0 : volume)
)

/**
 * Returns volume as percentage (0-100)
 */
export const selectVolumePercentage = createSelector([selectVolume], (volume) =>
  Math.round(volume * 100)
)

// ========================================
// Queue Information Selectors
// ========================================

/**
 * Returns information about the current position in queue
 */
export const selectQueuePosition = createSelector(
  [selectQueueIndex, selectQueueLength],
  (index, length) => ({
    current: index + 1,
    total: length,
    isFirst: index === 0,
    isLast: index === length - 1,
  })
)

/**
 * Returns the next track ID in queue (if any)
 */
export const selectNextTrackId = createSelector(
  [selectQueue, selectQueueIndex, selectRepeatMode],
  (queue, queueIndex, repeatMode) => {
    if (queue.length === 0) return null

    const isAtEnd = queueIndex >= queue.length - 1

    if (isAtEnd) {
      if (repeatMode === 'one') {
        return queue[queueIndex]
      } else if (repeatMode === 'all') {
        return queue[0]
      } else {
        return null
      }
    }

    return queue[queueIndex + 1]
  }
)

/**
 * Returns the previous track ID in queue (if any)
 */
export const selectPreviousTrackId = createSelector(
  [selectQueue, selectQueueIndex, selectRepeatMode],
  (queue, queueIndex, repeatMode) => {
    if (queue.length === 0) return null

    const isAtBeginning = queueIndex <= 0

    if (isAtBeginning) {
      if (repeatMode === 'all') {
        return queue[queue.length - 1]
      } else {
        return queue[0] // Current track (restart)
      }
    }

    return queue[queueIndex - 1]
  }
)

// ========================================
// Playback Mode Indicators
// ========================================

/**
 * Returns a user-friendly description of current playback mode
 */
export const selectPlaybackModeDescription = createSelector(
  [selectRepeatMode, selectShuffleMode],
  (repeatMode, shuffleMode) => {
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
)
