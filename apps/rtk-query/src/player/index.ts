// Audio instance
export { audio } from './player'

// Redux slice
export {
  addToQueue,
  clearError,
  clearQueue,
  handleTrackEnded,
  insertNext,
  // Queue actions
  loadPlaylist,
  // Navigation actions
  nextTrack,
  pause,
  playerSlice,
  // Playback control actions
  playTrack,
  playTrackAtIndex,
  previousTrack,
  removeFromQueue,
  resume,
  // Progress actions
  seek,
  setDuration,
  // Error actions
  setError,
  // Metadata actions
  setLoadingState,
  setPlaybackState,
  // Mode actions
  setRepeatMode,
  // Volume actions
  setVolume,
  stop,
  toggleMute,
  togglePlayPause,
  toggleShuffle,
  updateBuffered,
  updateTime,
} from './playerSlice'

// Middleware
export { playerMiddleware } from './playerMiddleware'

// Selectors
export {
  makeSelectIsCurrentTrack,
  makeSelectIsTrackInQueue,
  // Selector factories
  makeSelectTrackPlaybackState,
  makeSelectTrackProgress,
  makeSelectTrackQueuePosition,
  selectBuffered,
  selectCurrentPlaylistId,
  selectCurrentTime,
  selectCurrentTrack,
  selectCurrentTrackId,
  selectDuration,
  selectEffectiveVolume,
  selectError,
  selectFormattedTime,
  selectHasError,
  selectHasNextTrack,
  selectHasPreviousTrack,
  selectIsLoading,
  selectIsLoadingTrack,
  selectIsMuted,
  selectIsPaused,
  // Computed selectors
  selectIsPlaying,
  selectNextTrackId,
  selectOriginalQueue,
  selectPlaybackModeDescription,
  selectPlaybackState,
  // Basic selectors
  selectPlayerState,
  selectPreviousTrackId,
  selectProgress,
  selectQueue,
  selectQueueIndex,
  selectQueueLength,
  selectQueuePosition,
  selectQueueTrackIds,
  selectQueueTracks,
  selectRepeatMode,
  selectShuffleMode,
  selectVolume,
  selectVolumePercentage,
} from './playerSelectors'

// Hooks
export {
  useCurrentTrack,
  useIsCurrentTrack,
  usePlaybackModes,
  usePlaybackProgress,
  usePlaybackState,
  usePlayer,
  usePlayerControls,
  usePlayerKeyboardControls,
  usePlayerQueue,
  useQueue,
  useQueueControls,
  useTrackNavigation,
  useTrackPlaybackState,
  useTrackPlayer,
  useTrackProgress,
  useTrackQueuePosition,
  useVolumeControl,
} from './playerHooks'

// Types
export type {
  FormattedTime,
  PlaybackState,
  PlayerState,
  Playlist,
  RepeatMode,
  Track,
  TrackPlaybackState,
  TrackProgress,
} from './types/player.types'

// Utilities
export { formatTime, parseTime } from './utils/format-time.ts'
export { shuffle, shuffleWithCurrentItem } from './utils/shuffle'
export { debounce, throttle } from './utils/throttle'
