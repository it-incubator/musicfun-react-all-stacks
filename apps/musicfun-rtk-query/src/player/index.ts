// Audio instance
export { audio } from './player'

// Redux slice
export {
  playerSlice,
  // Playback control actions
  playTrack,
  pause,
  resume,
  stop,
  togglePlayPause,
  // Navigation actions
  nextTrack,
  previousTrack,
  playTrackAtIndex,
  handleTrackEnded,
  // Progress actions
  seek,
  updateTime,
  updateBuffered,
  setDuration,
  // Volume actions
  setVolume,
  toggleMute,
  // Mode actions
  setRepeatMode,
  toggleShuffle,
  // Queue actions
  loadPlaylist,
  addToQueue,
  insertNext,
  removeFromQueue,
  clearQueue,
  // Error actions
  setError,
  clearError,
  // Metadata actions
  setLoadingState,
  setPlaybackState,
} from './playerSlice'

// Middleware
export { playerMiddleware } from './playerMiddleware'

// Selectors
export {
  // Basic selectors
  selectPlayerState,
  selectCurrentTrackId,
  selectCurrentPlaylistId,
  selectPlaybackState,
  selectCurrentTime,
  selectDuration,
  selectBuffered,
  selectVolume,
  selectIsMuted,
  selectRepeatMode,
  selectShuffleMode,
  selectQueue,
  selectOriginalQueue,
  selectQueueIndex,
  selectError,
  selectIsLoadingTrack,
  selectHasNextTrack,
  selectHasPreviousTrack,
  // Computed selectors
  selectIsPlaying,
  selectIsPaused,
  selectIsLoading,
  selectHasError,
  selectProgress,
  selectFormattedTime,
  selectCurrentTrack,
  selectQueueTracks,
  selectQueueTrackIds,
  selectQueueLength,
  selectEffectiveVolume,
  selectVolumePercentage,
  selectQueuePosition,
  selectNextTrackId,
  selectPreviousTrackId,
  selectPlaybackModeDescription,
  // Selector factories
  makeSelectTrackPlaybackState,
  makeSelectTrackProgress,
  makeSelectIsCurrentTrack,
  makeSelectTrackQueuePosition,
  makeSelectIsTrackInQueue,
} from './playerSelectors'

// Hooks
export {
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
} from './playerHooks'

// Types
export type {
  Track,
  Playlist,
  PlaybackState,
  RepeatMode,
  PlayerState,
  TrackPlaybackState,
  TrackProgress,
  FormattedTime,
} from './types/player.types'

// Utilities
export { shuffle, shuffleWithCurrentItem, formatTime, parseTime, throttle, debounce } from './utils'
