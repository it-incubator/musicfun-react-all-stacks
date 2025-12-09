export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number // in seconds
  url: string
  albumArt?: string
  artistId?: string
  albumId?: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  trackIds: string[]
  createdAt: string
  updatedAt: string
  coverImage?: string
}

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'loading' | 'error'

export type RepeatMode = 'off' | 'one' | 'all'

export interface PlayerState {
  // Current playback state
  currentTrackId: string | null
  currentPlaylistId: string | null
  playbackState: PlaybackState

  // Playback position
  currentTime: number // in seconds
  duration: number // in seconds
  buffered: number // percentage 0-100

  // Volume control
  volume: number // 0-1
  isMuted: boolean

  // Playback modes
  repeatMode: RepeatMode
  shuffleMode: boolean

  // Queue management
  queue: string[] // ordered track IDs
  originalQueue: string[] // original order before shuffle
  queueIndex: number

  // Track entities - normalized storage
  tracks: Record<string, Track> // tracks stored by ID

  // Error handling
  error: string | null

  // Additional metadata
  isLoadingTrack: boolean
  hasNextTrack: boolean
  hasPreviousTrack: boolean
}

export interface TrackPlaybackState {
  isCurrentTrack: boolean
  isPlaying: boolean
  isPaused: boolean
  playbackState: PlaybackState
}

export interface TrackProgress {
  progress: number
  currentTime: number
}

export interface FormattedTime {
  current: string
  duration: string
}
