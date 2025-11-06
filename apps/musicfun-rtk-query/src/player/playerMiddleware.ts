import { audio } from './player'
import {
  handleTrackEnded,
  pause,
  playTrack,
  resume,
  seek,
  setDuration,
  setError,
  setLoadingState,
  setPlaybackState,
  setVolume,
  toggleMute,
  updateBuffered,
  updateTime,
} from './playerSlice'
import { throttle } from './utils/throttle'

// Flag to track if event listeners are already attached
let listenersAttached = false

/**
 * Redux middleware that syncs player state with HTML5 Audio API
 * This middleware intercepts player actions and updates the audio element accordingly
 */
export const playerMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action)
  const state = store.getState()
  const playerState = state.player

  // Attach event listeners once
  if (!listenersAttached) {
    setupAudioEventListeners(store)
    listenersAttached = true
  }

  // Handle different actions
  if (playTrack.match(action)) {
    const { track } = action.payload

    // Get track URL from state
    const trackUrl = track.url

    if (trackUrl) {
      audio.src = trackUrl
      audio.currentTime = 0
      audio
        .play()
        .then(() => {
          store.dispatch(setPlaybackState('playing'))
        })
        .catch((error: Error) => {
          store.dispatch(setError(error.message || 'Failed to play track'))
        })
    } else {
      store.dispatch(setError('Track URL not found'))
    }
  } else if (pause.match(action)) {
    audio.pause()
  } else if (resume.match(action)) {
    audio
      .play()
      .then(() => {
        store.dispatch(setPlaybackState('playing'))
      })
      .catch((error: Error) => {
        store.dispatch(setError(error.message || 'Failed to resume playback'))
      })
  } else if (seek.match(action)) {
    audio.currentTime = action.payload
  } else if (setVolume.match(action)) {
    audio.volume = action.payload
  } else if (toggleMute.match(action)) {
    audio.muted = playerState.isMuted
  }

  return result
}

/**
 * Sets up event listeners on the audio element
 * These listeners dispatch Redux actions when audio events occur
 */
function setupAudioEventListeners(store: any) {
  const dispatch = store.dispatch

  // Throttled time update (max once per second)
  const throttledTimeUpdate = throttle(() => {
    dispatch(updateTime(audio.currentTime))
  }, 1000)

  // Track metadata loaded
  audio.addEventListener('loadedmetadata', () => {
    dispatch(setDuration(audio.duration))
    dispatch(setLoadingState(false))
  })

  // Track time updates
  audio.addEventListener('timeupdate', throttledTimeUpdate)

  // Track ended
  audio.addEventListener('ended', () => {
    dispatch(handleTrackEnded())
  })

  // Error occurred
  audio.addEventListener('error', () => {
    const errorMessage =
      audio.error?.message || `Error code: ${audio.error?.code}` || 'Unknown playback error'
    dispatch(setError(errorMessage))
  })

  // Loading started
  audio.addEventListener('loadstart', () => {
    dispatch(setLoadingState(true))
  })

  // Can start playing
  audio.addEventListener('canplay', () => {
    dispatch(setLoadingState(false))
  })

  // Buffering progress
  audio.addEventListener('progress', () => {
    if (audio.buffered.length > 0 && audio.duration > 0) {
      const buffered = (audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100
      dispatch(updateBuffered(buffered))
    }
  })

  // Waiting for data (buffering)
  audio.addEventListener('waiting', () => {
    dispatch(setLoadingState(true))
  })

  // Playing after waiting
  audio.addEventListener('playing', () => {
    dispatch(setLoadingState(false))
    dispatch(setPlaybackState('playing'))
  })

  // Paused
  audio.addEventListener('pause', () => {
    // Only update state if not transitioning to a new track
    if (audio.currentTime > 0) {
      dispatch(setPlaybackState('paused'))
    }
  })

  // Volume changed (from browser controls)
  audio.addEventListener('volumechange', () => {
    // Only dispatch if volume was changed externally (not from our actions)
    // This prevents infinite loops
    if (Math.abs(audio.volume - store.getState().player.volume) > 0.01) {
      dispatch(setVolume(audio.volume))
    }
  })
}
