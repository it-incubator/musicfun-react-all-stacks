import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PlayerState, RepeatMode, Track } from './types/player.types'
import { shuffle, shuffleWithCurrentItem } from './utils'

// Load persisted preferences from localStorage
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

const initialState: PlayerState = {
  // Current playback state
  currentTrackId: null,
  currentPlaylistId: null,
  playbackState: 'idle',

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
  queue: [],
  originalQueue: [],
  queueIndex: -1,

  // Track entities
  tracks: {},

  // Error handling
  error: null,

  // Additional metadata
  isLoadingTrack: false,
  hasNextTrack: false,
  hasPreviousTrack: false,
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // ========================================
    // Playback Control
    // ========================================

    playTrack: (
      state,
      action: PayloadAction<{
        track: Track
        playlistId?: string
        tracks?: Track[]
      }>
    ) => {
      const { track, playlistId, tracks } = action.payload

      // Store track in entities
      state.tracks[track.id] = track

      // If this is a new track
      if (state.currentTrackId !== track.id) {
        state.currentTrackId = track.id
        state.currentPlaylistId = playlistId || null
        state.currentTime = 0
        state.duration = 0
        state.buffered = 0
        state.playbackState = 'loading'
        state.error = null

        // If tracks array is provided, set up queue with all tracks
        if (tracks && tracks.length > 0) {
          // Store all tracks in entities
          tracks.forEach((t) => {
            state.tracks[t.id] = t
          })

          const trackIds = tracks.map((t) => t.id)
          state.originalQueue = trackIds
          state.queue = state.shuffleMode ? shuffle(trackIds) : trackIds
          state.queueIndex = state.queue.indexOf(track.id)
        } else if (state.queue.length === 0) {
          // If no queue exists, create one with just this track
          state.queue = [track.id]
          state.originalQueue = [track.id]
          state.queueIndex = 0
        } else {
          // Find track in existing queue
          const index = state.queue.indexOf(track.id)
          if (index !== -1) {
            state.queueIndex = index
          } else {
            // Track not in queue, add it
            state.queue.push(track.id)
            state.originalQueue.push(track.id)
            state.queueIndex = state.queue.length - 1
          }
        }
      } else if (state.playbackState === 'paused') {
        // Same track, just resume
        state.playbackState = 'playing'
      }

      playerSlice.caseReducers.updateQueueMetadata(state)
    },

    pause: (state) => {
      if (state.playbackState === 'playing') {
        state.playbackState = 'paused'
      }
    },

    resume: (state) => {
      if (state.playbackState === 'paused') {
        state.playbackState = 'playing'
      }
    },

    stop: (state) => {
      state.playbackState = 'idle'
      state.currentTime = 0
    },

    togglePlayPause: (state) => {
      if (state.playbackState === 'playing') {
        state.playbackState = 'paused'
      } else if (state.playbackState === 'paused' || state.playbackState === 'idle') {
        state.playbackState = 'playing'
      }
    },

    // ========================================
    // Navigation
    // ========================================

    nextTrack: (state) => {
      if (state.queue.length === 0) return

      // Repeat one - replay current track
      if (state.repeatMode === 'one') {
        state.currentTime = 0
        return
      }

      // Check if at end of queue
      const isAtEnd = state.queueIndex >= state.queue.length - 1

      if (isAtEnd) {
        if (state.repeatMode === 'all') {
          // Loop to beginning
          state.queueIndex = 0
          state.currentTrackId = state.queue[0]
          state.currentTime = 0
          state.playbackState = 'loading'
        } else {
          // Stop playback
          state.playbackState = 'idle'
          state.currentTime = 0
        }
      } else {
        // Go to next track
        state.queueIndex++
        state.currentTrackId = state.queue[state.queueIndex]
        state.currentTime = 0
        state.playbackState = 'loading'
      }

      playerSlice.caseReducers.updateQueueMetadata(state)
    },

    previousTrack: (state) => {
      if (state.queue.length === 0) return

      // If more than 3 seconds into track, restart current track
      if (state.currentTime > 3) {
        state.currentTime = 0
        return
      }

      // Check if at beginning of queue
      const isAtBeginning = state.queueIndex <= 0

      if (isAtBeginning) {
        if (state.repeatMode === 'all') {
          // Loop to end
          state.queueIndex = state.queue.length - 1
          state.currentTrackId = state.queue[state.queueIndex]
          state.currentTime = 0
          state.playbackState = 'loading'
        } else {
          // Restart current track
          state.currentTime = 0
        }
      } else {
        // Go to previous track
        state.queueIndex--
        state.currentTrackId = state.queue[state.queueIndex]
        state.currentTime = 0
        state.playbackState = 'loading'
      }

      playerSlice.caseReducers.updateQueueMetadata(state)
    },

    playTrackAtIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload

      if (index >= 0 && index < state.queue.length) {
        state.queueIndex = index
        state.currentTrackId = state.queue[index]
        state.currentTime = 0
        state.playbackState = 'loading'
        playerSlice.caseReducers.updateQueueMetadata(state)
      }
    },

    handleTrackEnded: (state) => {
      // Automatically play next track when current track ends
      playerSlice.caseReducers.nextTrack(state)
    },

    // ========================================
    // Progress
    // ========================================

    seek: (state, action: PayloadAction<number>) => {
      const time = action.payload

      // Validate position
      if (time >= 0 && time <= state.duration) {
        state.currentTime = time
      }
    },

    updateTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },

    updateBuffered: (state, action: PayloadAction<number>) => {
      state.buffered = Math.max(0, Math.min(100, action.payload))
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },

    // ========================================
    // Volume
    // ========================================

    setVolume: (state, action: PayloadAction<number>) => {
      const volume = Math.max(0, Math.min(1, action.payload))
      state.volume = volume

      // Auto-unmute if volume > 0
      if (volume > 0) {
        state.isMuted = false
      }

      // Persist to localStorage
      try {
        localStorage.setItem('player_volume', volume.toString())
      } catch {
        // Ignore localStorage errors
      }
    },

    toggleMute: (state) => {
      state.isMuted = !state.isMuted
    },

    // ========================================
    // Playback Modes
    // ========================================

    setRepeatMode: (state, action: PayloadAction<RepeatMode>) => {
      state.repeatMode = action.payload
      playerSlice.caseReducers.updateQueueMetadata(state)

      // Persist to localStorage
      try {
        localStorage.setItem('player_repeat_mode', action.payload)
      } catch {
        // Ignore localStorage errors
      }
    },

    toggleShuffle: (state) => {
      state.shuffleMode = !state.shuffleMode

      if (state.shuffleMode) {
        // Enable shuffle
        if (state.currentTrackId) {
          // Shuffle but keep current track at current position
          state.queue = shuffleWithCurrentItem(
            state.originalQueue,
            state.originalQueue.indexOf(state.currentTrackId)
          )
          state.queueIndex = 0 // Current track is now at index 0
        } else {
          state.queue = shuffle(state.originalQueue)
        }
      } else {
        // Disable shuffle - restore original order
        state.queue = [...state.originalQueue]

        // Find current track in original queue
        if (state.currentTrackId) {
          state.queueIndex = state.queue.indexOf(state.currentTrackId)
        }
      }

      playerSlice.caseReducers.updateQueueMetadata(state)

      // Persist to localStorage
      try {
        localStorage.setItem('player_shuffle', state.shuffleMode.toString())
      } catch {
        // Ignore localStorage errors
      }
    },

    // ========================================
    // Queue Management
    // ========================================

    loadPlaylist: (
      state,
      action: PayloadAction<{
        playlistId: string
        tracks: Track[]
        startIndex?: number
      }>
    ) => {
      const { playlistId, tracks, startIndex = 0 } = action.payload

      // Store all tracks in entities
      tracks.forEach((track) => {
        state.tracks[track.id] = track
      })

      const trackIds = tracks.map((t) => t.id)
      state.currentPlaylistId = playlistId
      state.originalQueue = trackIds
      state.queue = state.shuffleMode ? shuffle(trackIds) : trackIds
      state.queueIndex = Math.max(0, Math.min(startIndex, tracks.length - 1))
      state.currentTrackId = state.queue[state.queueIndex]
      state.currentTime = 0
      state.playbackState = 'loading'

      playerSlice.caseReducers.updateQueueMetadata(state)
    },

    addToQueue: (state, action: PayloadAction<Track[]>) => {
      const tracks = action.payload

      // Store tracks in entities
      tracks.forEach((track) => {
        state.tracks[track.id] = track
      })

      const trackIds = tracks.map((t) => t.id)
      state.originalQueue.push(...trackIds)

      if (state.shuffleMode) {
        // In shuffle mode, add tracks in random positions
        const shuffledNew = shuffle(trackIds)
        state.queue.push(...shuffledNew)
      } else {
        state.queue.push(...trackIds)
      }

      playerSlice.caseReducers.updateQueueMetadata(state)
    },

    insertNext: (state, action: PayloadAction<Track>) => {
      const track = action.payload

      // Store track in entities
      state.tracks[track.id] = track

      // Find position in original queue
      const currentOriginalIndex = state.originalQueue.indexOf(state.currentTrackId || '')

      // Insert after current track in both queues
      state.originalQueue.splice(currentOriginalIndex + 1, 0, track.id)
      state.queue.splice(state.queueIndex + 1, 0, track.id)

      playerSlice.caseReducers.updateQueueMetadata(state)
    },

    removeFromQueue: (state, action: PayloadAction<number>) => {
      const index = action.payload

      if (index < 0 || index >= state.queue.length) return

      const trackId = state.queue[index]

      // Remove from queue
      state.queue.splice(index, 1)

      // Remove from original queue
      const originalIndex = state.originalQueue.indexOf(trackId)
      if (originalIndex !== -1) {
        state.originalQueue.splice(originalIndex, 1)
      }

      // Adjust queue index
      if (index < state.queueIndex) {
        state.queueIndex--
      } else if (index === state.queueIndex) {
        // Removing current track - play next
        if (state.queue.length > 0) {
          if (state.queueIndex >= state.queue.length) {
            state.queueIndex = state.queue.length - 1
          }
          state.currentTrackId = state.queue[state.queueIndex]
          state.currentTime = 0
          state.playbackState = 'loading'
        } else {
          // Queue is empty
          state.currentTrackId = null
          state.queueIndex = -1
          state.playbackState = 'idle'
        }
      }

      playerSlice.caseReducers.updateQueueMetadata(state)
    },

    clearQueue: (state) => {
      state.queue = []
      state.originalQueue = []
      state.queueIndex = -1
      state.currentTrackId = null
      state.currentPlaylistId = null
      state.playbackState = 'idle'
      state.currentTime = 0
      state.duration = 0
      playerSlice.caseReducers.updateQueueMetadata(state)
    },

    // ========================================
    // Error Handling
    // ========================================

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.playbackState = 'error'
    },

    clearError: (state) => {
      state.error = null
      if (state.playbackState === 'error') {
        state.playbackState = 'idle'
      }
    },

    // ========================================
    // Metadata
    // ========================================

    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTrack = action.payload
      if (action.payload && state.playbackState !== 'error') {
        state.playbackState = 'loading'
      }
    },

    setPlaybackState: (state, action: PayloadAction<PlayerState['playbackState']>) => {
      state.playbackState = action.payload
    },

    // ========================================
    // Internal Helpers
    // ========================================

    updateQueueMetadata: (state) => {
      // Update hasNext and hasPrevious flags
      if (state.queue.length === 0) {
        state.hasNextTrack = false
        state.hasPreviousTrack = false
        return
      }

      const isAtEnd = state.queueIndex >= state.queue.length - 1
      const isAtBeginning = state.queueIndex <= 0

      // Has next if not at end, or if repeat mode is on
      state.hasNextTrack = !isAtEnd || state.repeatMode === 'all' || state.repeatMode === 'one'

      // Has previous if not at beginning, or if repeat mode is 'all', or if more than 3 seconds into track
      state.hasPreviousTrack = !isAtBeginning || state.repeatMode === 'all' || state.currentTime > 3
    },
  },
})

export const {
  // Playback control
  playTrack,
  pause,
  resume,
  stop,
  togglePlayPause,

  // Navigation
  nextTrack,
  previousTrack,
  playTrackAtIndex,
  handleTrackEnded,

  // Progress
  seek,
  updateTime,
  updateBuffered,
  setDuration,

  // Volume
  setVolume,
  toggleMute,

  // Modes
  setRepeatMode,
  toggleShuffle,

  // Queue
  loadPlaylist,
  addToQueue,
  insertNext,
  removeFromQueue,
  clearQueue,

  // Error handling
  setError,
  clearError,

  // Metadata
  setLoadingState,
  setPlaybackState,
} = playerSlice.actions

export default playerSlice.reducer
