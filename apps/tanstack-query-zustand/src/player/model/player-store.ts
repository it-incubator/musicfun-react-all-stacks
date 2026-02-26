import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { PlayerState, RepeatMode, Track } from '../types/player.types'
import { audioManager } from './audio-manager'
import { shuffle, shuffleWithCurrentItem } from '../utils'

// ========================================
// Persistence helpers
// ========================================

const loadPersistedVolume = (): number => {
  try {
    const volume = localStorage.getItem('player_volume')
    return volume ? parseFloat(volume) : 1
  } catch {
    return 1
  }
}

const loadPersistedRepeatMode = (): RepeatMode => {
  try {
    const mode = localStorage.getItem('player_repeat_mode')
    return (mode as RepeatMode) || 'off'
  } catch {
    return 'off'
  }
}

const loadPersistedShuffle = (): boolean => {
  try {
    const shuffle = localStorage.getItem('player_shuffle')
    return shuffle === 'true'
  } catch {
    return false
  }
}

// ========================================
// Initial State
// ========================================

const initialState = {
  // Current playback state
  currentTrackId: null as string | null,
  currentPlaylistId: null as string | null,
  playbackState: 'idle' as PlayerState['playbackState'],

  // Playback position
  currentTime: 0,
  duration: 0,
  buffered: 0,

  // Volume control
  volume: loadPersistedVolume(),
  isMuted: false,

  // Playback modes
  repeatMode: loadPersistedRepeatMode(),
  shuffleMode: loadPersistedShuffle(),

  // Queue management
  queue: [] as string[],
  originalQueue: [] as string[],
  queueIndex: -1,

  // Track entities - normalized storage
  tracks: {} as Record<string, Track>,

  // Error handling
  error: null as string | null,

  // Additional metadata
  isLoadingTrack: false,
  hasNextTrack: false,
  hasPreviousTrack: false,
}

// ========================================
// Zustand Store
// ========================================

type PlayerStore = typeof initialState & {
  // Playback actions
  play: (track: Track, playlistId?: string, tracks?: Track[]) => void
  pause: () => void
  resume: () => void
  stop: () => void
  togglePlayPause: () => void

  // Navigation actions
  nextTrack: () => void
  previousTrack: () => void
  playTrackAtIndex: (index: number) => void
  handleTrackEnded: () => void

  // Progress actions
  seek: (time: number) => void
  updateTime: (time: number) => void
  updateBuffered: (buffered: number) => void
  setDuration: (duration: number) => void

  // Volume actions
  setVolume: (volume: number) => void
  toggleMute: () => void

  // Mode actions
  setRepeatMode: (mode: RepeatMode) => void
  toggleShuffle: () => void

  // Queue actions
  loadPlaylist: (playlistId: string, tracks: Track[], startIndex?: number) => void
  addToQueue: (tracks: Track[]) => void
  insertNext: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void

  // Error actions
  setError: (error: string) => void
  clearError: () => void

  // Internal helpers
  updateQueueMetadata: () => void
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================
      // Playback Control
      // ========================================

      play(track, playlistId?, tracks?) {
        const state = get()

        // Store track in entities
        const newTracks = { ...state.tracks, [track.id]: track }
        set({ tracks: newTracks })

        // If this is a new track
        if (state.currentTrackId !== track.id) {
          set({
            currentTrackId: track.id,
            currentPlaylistId: playlistId || null,
            currentTime: 0,
            duration: 0,
            buffered: 0,
            playbackState: 'loading',
            error: null,
          })

          // If tracks array is provided, set up queue with all tracks
          if (tracks && tracks.length > 0) {
            tracks.forEach((t) => {
              newTracks[t.id] = t
            })
            set({ tracks: newTracks })

            const trackIds = tracks.map((t) => t.id)
            const newQueue = state.shuffleMode ? shuffle(trackIds) : trackIds
            const newQueueIndex = newQueue.indexOf(track.id)

            set({
              queue: newQueue,
              originalQueue: trackIds,
              queueIndex: newQueueIndex,
            })
          } else if (state.queue.length === 0) {
            // If no queue exists, create one with just this track
            set({
              queue: [track.id],
              originalQueue: [track.id],
              queueIndex: 0,
            })
          } else {
            // Find track in existing queue
            const index = state.queue.indexOf(track.id)
            if (index !== -1) {
              set({ queueIndex: index })
            } else {
              // Track not in queue, add it
              const newQueue = [...state.queue, track.id]
              const newOriginalQueue = [...state.originalQueue, track.id]
              set({
                queue: newQueue,
                originalQueue: newOriginalQueue,
                queueIndex: newQueue.length - 1,
              })
            }
          }

          // Load and play the track
          audioManager
            .loadTrack(track)
            .then(() => {
              audioManager.play()
              set({ playbackState: 'playing' })
            })
            .catch((error) => {
              set({
                playbackState: 'error',
                error: error.message,
              })
            })
        } else if (state.playbackState === 'paused') {
          // Same track, just resume
          audioManager.play()
          set({ playbackState: 'playing' })
        } else if (state.playbackState === 'idle' || state.playbackState === 'error') {
          // Same track after ended/stopped/error - reload source and play again
          set({
            currentTime: 0,
            duration: 0,
            buffered: 0,
            playbackState: 'loading',
            error: null,
          })

          audioManager
            .loadTrack(track)
            .then(() => {
              audioManager.play()
              set({ playbackState: 'playing' })
            })
            .catch((error) => {
              set({
                playbackState: 'error',
                error: error.message,
              })
            })
        }
      },

      pause() {
        const state = get()
        if (state.playbackState === 'playing') {
          audioManager.pause()
          set({ playbackState: 'paused' })
        }
      },

      resume() {
        const state = get()
        if (state.playbackState === 'paused') {
          audioManager.play()
          set({ playbackState: 'playing' })
        }
      },

      stop() {
        audioManager.stop()
        set({
          playbackState: 'idle',
          currentTime: 0,
        })
      },

      togglePlayPause() {
        const state = get()
        if (state.playbackState === 'playing') {
          audioManager.pause()
          set({ playbackState: 'paused' })
        } else if (state.playbackState === 'paused' || state.playbackState === 'idle') {
          if (state.currentTrackId && state.tracks[state.currentTrackId]) {
            audioManager.play()
            set({ playbackState: 'playing' })
          }
        }
      },

      // ========================================
      // Navigation
      // ========================================

      nextTrack() {
        const state = get()
        if (state.queue.length === 0) return

        const isAtEnd = state.queueIndex >= state.queue.length - 1

        if (isAtEnd) {
          if (state.repeatMode === 'all') {
            // Loop to beginning
            const newIndex = 0
            const newTrackId = state.queue[newIndex]
            set({
              queueIndex: newIndex,
              currentTrackId: newTrackId,
              currentTime: 0,
              playbackState: 'loading',
            })

            // Play next track
            const track = state.tracks[newTrackId]
            if (track) {
              audioManager
                .loadTrack(track)
                .then(() => {
                  audioManager.play()
                  set({ playbackState: 'playing' })
                })
                .catch((error) => {
                  set({
                    playbackState: 'error',
                    error: error.message,
                  })
                })
            }
          } else {
            // Stop playback
            audioManager.stop()
            set({
              playbackState: 'idle',
              currentTime: 0,
            })
          }
        } else {
          // Go to next track
          const newIndex = state.queueIndex + 1
          const newTrackId = state.queue[newIndex]
          set({
            queueIndex: newIndex,
            currentTrackId: newTrackId,
            currentTime: 0,
            playbackState: 'loading',
          })

          const track = state.tracks[newTrackId]
          if (track) {
            audioManager
              .loadTrack(track)
              .then(() => {
                audioManager.play()
                set({ playbackState: 'playing' })
              })
              .catch((error) => {
                set({
                  playbackState: 'error',
                  error: error.message,
                })
              })
          }
        }
        get().updateQueueMetadata()
      },

      previousTrack() {
        const state = get()
        if (state.queue.length === 0) return

        // If more than 3 seconds into track, restart current track
        if (state.currentTime > 3) {
          audioManager.seek(0)
          set({ currentTime: 0 })
          return
        }

        const isAtBeginning = state.queueIndex <= 0

        if (isAtBeginning) {
          if (state.repeatMode === 'all') {
            // Loop to end
            const newIndex = state.queue.length - 1
            const newTrackId = state.queue[newIndex]
            set({
              queueIndex: newIndex,
              currentTrackId: newTrackId,
              currentTime: 0,
              playbackState: 'loading',
            })

            const track = state.tracks[newTrackId]
            if (track) {
              audioManager
                .loadTrack(track)
                .then(() => {
                  audioManager.play()
                  set({ playbackState: 'playing' })
                })
                .catch((error) => {
                  set({
                    playbackState: 'error',
                    error: error.message,
                  })
                })
            }
          } else {
            // Restart current track
            audioManager.seek(0)
            set({ currentTime: 0 })
          }
        } else {
          // Go to previous track
          const newIndex = state.queueIndex - 1
          const newTrackId = state.queue[newIndex]
          set({
            queueIndex: newIndex,
            currentTrackId: newTrackId,
            currentTime: 0,
            playbackState: 'loading',
          })

          const track = state.tracks[newTrackId]
          if (track) {
            audioManager
              .loadTrack(track)
              .then(() => {
                audioManager.play()
                set({ playbackState: 'playing' })
              })
              .catch((error) => {
                set({
                  playbackState: 'error',
                  error: error.message,
                })
              })
          }
        }
        get().updateQueueMetadata()
      },

      playTrackAtIndex(index) {
        const state = get()
        if (index >= 0 && index < state.queue.length) {
          const trackId = state.queue[index]
          set({
            queueIndex: index,
            currentTrackId: trackId,
            currentTime: 0,
            playbackState: 'loading',
          })

          const track = state.tracks[trackId]
          if (track) {
            audioManager
              .loadTrack(track)
              .then(() => {
                audioManager.play()
                set({ playbackState: 'playing' })
              })
              .catch((error) => {
                set({
                  playbackState: 'error',
                  error: error.message,
                })
              })
          }
        }
        get().updateQueueMetadata()
      },

      handleTrackEnded() {
        const state = get()
        // Repeat one - replay current track
        if (state.repeatMode === 'one') {
          audioManager.seek(0)
          audioManager.play()
          set({ currentTime: 0, playbackState: 'playing' })
          return
        }
        // Automatically play next track
        get().nextTrack()
      },

      // ========================================
      // Progress
      // ========================================

      seek(time) {
        const state = get()
        if (time >= 0 && time <= state.duration) {
          audioManager.seek(time)
          set({ currentTime: time })
        }
      },

      updateTime(time) {
        set({ currentTime: time })
      },

      updateBuffered(buffered) {
        set({ buffered: Math.max(0, Math.min(100, buffered)) })
      },

      setDuration(duration) {
        set({ duration })
      },

      // ========================================
      // Volume
      // ========================================

      setVolume(volume) {
        const clampedVolume = Math.max(0, Math.min(1, volume))
        audioManager.setVolume(clampedVolume)

        // Auto-unmute if volume > 0
        if (clampedVolume > 0) {
          audioManager.setMuted(false)
          set({ volume: clampedVolume, isMuted: false })
        } else {
          set({ volume: clampedVolume, isMuted: true })
        }

        // Persist to localStorage
        try {
          localStorage.setItem('player_volume', clampedVolume.toString())
        } catch {
          // Ignore
        }
      },

      toggleMute() {
        const state = get()
        const newIsMuted = !state.isMuted
        audioManager.setMuted(newIsMuted)
        set({ isMuted: newIsMuted })
      },

      // ========================================
      // Playback Modes
      // ========================================

      setRepeatMode(mode) {
        const state = get()
        set({ repeatMode: mode })
        get().updateQueueMetadata()

        // Persist to localStorage
        try {
          localStorage.setItem('player_repeat_mode', mode)
        } catch {
          // Ignore
        }
      },

      toggleShuffle() {
        const state = get()
        const newShuffleMode = !state.shuffleMode
        set({ shuffleMode: newShuffleMode })

        if (newShuffleMode) {
          // Enable shuffle
          if (state.currentTrackId) {
            const currentOriginalIndex = state.originalQueue.indexOf(state.currentTrackId)
            const newQueue = shuffleWithCurrentItem(state.originalQueue, currentOriginalIndex)
            set({ queue: newQueue, queueIndex: 0 })
          } else {
            set({ queue: shuffle(state.originalQueue) })
          }
        } else {
          // Disable shuffle - restore original order
          const restoredQueue = [...state.originalQueue]
          set({ queue: restoredQueue })

          // Find current track in original queue
          if (state.currentTrackId) {
            const newIndex = restoredQueue.indexOf(state.currentTrackId)
            set({ queueIndex: newIndex })
          }
        }
        get().updateQueueMetadata()

        // Persist to localStorage
        try {
          localStorage.setItem('player_shuffle', newShuffleMode.toString())
        } catch {
          // Ignore
        }
      },

      // ========================================
      // Queue Management
      // ========================================

      loadPlaylist(playlistId, tracks, startIndex = 0) {
        const state = get()

        // Store all tracks in entities
        const newTracks = { ...state.tracks }
        tracks.forEach((track) => {
          newTracks[track.id] = track
        })

        const trackIds = tracks.map((t) => t.id)
        const newQueue = state.shuffleMode ? shuffle(trackIds) : trackIds
        const newQueueIndex = Math.max(0, Math.min(startIndex, tracks.length - 1))

        set({
          tracks: newTracks,
          currentPlaylistId: playlistId,
          queue: newQueue,
          originalQueue: trackIds,
          queueIndex: newQueueIndex,
          currentTrackId: null,
          currentTime: 0,
          playbackState: 'loading',
        })

        // Start playing the first track
        const trackId = newQueue[newQueueIndex]
        const track = newTracks[trackId]
        if (track) {
          audioManager
            .loadTrack(track)
            .then(() => {
              audioManager.play()
              set({ playbackState: 'playing' })
            })
            .catch((error) => {
              set({
                playbackState: 'error',
                error: error.message,
              })
            })
        }
        get().updateQueueMetadata()
      },

      addToQueue(tracks) {
        const state = get()

        // Store tracks in entities
        const newTracks = { ...state.tracks }
        tracks.forEach((track) => {
          newTracks[track.id] = track
        })

        const trackIds = tracks.map((t) => t.id)
        const newOriginalQueue = [...state.originalQueue, ...trackIds]

        let newQueue: string[]
        if (state.shuffleMode) {
          // In shuffle mode, add tracks in random positions
          const shuffledNew = shuffle(trackIds)
          newQueue = [...state.queue, ...shuffledNew]
        } else {
          newQueue = [...state.queue, ...trackIds]
        }

        set({
          tracks: newTracks,
          originalQueue: newOriginalQueue,
          queue: newQueue,
        })
        get().updateQueueMetadata()
      },

      insertNext(track) {
        const state = get()

        // Store track in entities
        const newTracks = { ...state.tracks, [track.id]: track }
        const currentOriginalIndex = state.originalQueue.indexOf(state.currentTrackId || '')

        // Insert after current track in both queues
        const newOriginalQueue = [...state.originalQueue]
        const newQueue = [...state.queue]

        newOriginalQueue.splice(currentOriginalIndex + 1, 0, track.id)
        newQueue.splice(state.queueIndex + 1, 0, track.id)

        set({
          tracks: newTracks,
          originalQueue: newOriginalQueue,
          queue: newQueue,
        })
        get().updateQueueMetadata()
      },

      removeFromQueue(index) {
        const state = get()
        if (index < 0 || index >= state.queue.length) return

        const newQueue = [...state.queue]
        const trackId = newQueue[index]
        newQueue.splice(index, 1)

        const newOriginalQueue = [...state.originalQueue]
        const originalIndex = newOriginalQueue.indexOf(trackId)
        if (originalIndex !== -1) {
          newOriginalQueue.splice(originalIndex, 1)
        }

        // Adjust queue index
        let newQueueIndex = state.queueIndex
        if (index < state.queueIndex) {
          newQueueIndex--
        } else if (index === state.queueIndex) {
          // Removing current track - play next
          if (newQueue.length > 0) {
            if (newQueueIndex >= newQueue.length) {
              newQueueIndex = newQueue.length - 1
            }
          } else {
            newQueueIndex = -1
          }
        }

        set({
          queue: newQueue,
          originalQueue: newOriginalQueue,
          queueIndex: newQueueIndex,
        })
        get().updateQueueMetadata()
      },

      clearQueue() {
        set({
          queue: [],
          originalQueue: [],
          queueIndex: -1,
          currentTrackId: null,
          currentPlaylistId: null,
          playbackState: 'idle',
          currentTime: 0,
          duration: 0,
        })
        audioManager.stop()
        get().updateQueueMetadata()
      },

      // ========================================
      // Error Handling
      // ========================================

      setError(error) {
        set({
          error,
          playbackState: 'error',
        })
      },

      clearError() {
        const state = get()
        if (state.playbackState === 'error') {
          set({
            error: null,
            playbackState: 'idle',
          })
        } else {
          set({ error: null })
        }
      },

      // ========================================
      // Internal Helpers
      // ========================================

      updateQueueMetadata() {
        const state = get()
        if (state.queue.length === 0) {
          set({ hasNextTrack: false, hasPreviousTrack: false })
          return
        }

        const isAtEnd = state.queueIndex >= state.queue.length - 1
        const isAtBeginning = state.queueIndex <= 0

        // Has next if not at end, or if repeat mode is on
        const hasNextTrack = !isAtEnd || state.repeatMode === 'all' || state.repeatMode === 'one'

        // Has previous if not at beginning, or if repeat mode is 'all', or if more than 3 seconds into track
        const hasPreviousTrack =
          !isAtBeginning || state.repeatMode === 'all' || state.currentTime > 3

        set({ hasNextTrack, hasPreviousTrack })
      },
    }),
    {
      name: 'musicfun-player',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        shuffleMode: state.shuffleMode,
        // Don't persist queue and current track to avoid sync issues
      }),
    }
  )
)

// ========================================
// Audio Event Listeners Setup
// ========================================

let audioListenersSetup = false
let cleanupListeners: (() => void) | null = null

export function setupAudioListeners() {
  if (audioListenersSetup) return

  audioListenersSetup = true

  const timeupdateHandler = (time: number) => {
    usePlayerStore.setState({ currentTime: time })
  }

  const loadedmetadataHandler = ({ duration }: { duration: number }) => {
    usePlayerStore.setState({ duration, isLoadingTrack: false })
  }

  const endedHandler = () => {
    usePlayerStore.getState().handleTrackEnded()
  }

  const errorHandler = (error: string) => {
    usePlayerStore.setState({
      playbackState: 'error',
      error,
      isLoadingTrack: false,
    })
  }

  const waitingHandler = () => {
    usePlayerStore.setState({ isLoadingTrack: true })
  }

  const canplayHandler = () => {
    usePlayerStore.setState({ isLoadingTrack: false })
  }

  audioManager.on('timeupdate', timeupdateHandler)
  audioManager.on('loadedmetadata', loadedmetadataHandler)
  audioManager.on('ended', endedHandler)
  audioManager.on('error', errorHandler)
  audioManager.on('waiting', waitingHandler)
  audioManager.on('canplay', canplayHandler)

  // Return cleanup function
  cleanupListeners = () => {
    audioManager.off('timeupdate', timeupdateHandler)
    audioManager.off('loadedmetadata', loadedmetadataHandler)
    audioManager.off('ended', endedHandler)
    audioManager.off('error', errorHandler)
    audioManager.off('waiting', waitingHandler)
    audioManager.off('canplay', canplayHandler)
    audioListenersSetup = false
  }
}

// Initialize audio listeners on first use
export function initializePlayer() {
  setupAudioListeners()
}

// Cleanup function for testing or unmount
export function cleanupPlayer() {
  if (cleanupListeners) {
    cleanupListeners()
    cleanupListeners = null
  }
}
