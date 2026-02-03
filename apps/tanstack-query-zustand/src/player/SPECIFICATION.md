# Music Player Zustand Store - Technical Specification

## 1. Overview

This specification defines a Zustand store that wraps the HTML5 Audio API to create a fully-featured music player with playlist support, multiple playback modes, and performance-optimized state management.

## 2. Architecture

### 2.1 Core Components

```
src/player/
├── model/
│   ├── player-store.ts      # Main Zustand store
│   ├── player-track-hooks.ts # Track-specific hooks (performance critical)
│   ├── player-hooks.ts     # Global React hooks
│   ├── audio-manager.ts    # Singleton Audio wrapper
│   └── utils/
│       ├── shuffle.ts      # Fisher-Yates shuffle
│       ├── format-time.ts  # Time formatting
│       ├── track-navigation.ts # Queue navigation logic
│       └── convert-api-track-to-player-track.ts # API mappers
├── types/
│   └── player.types.ts     # TypeScript interfaces
└── index.ts                # Main exports
```

### 2.2 State Management Pattern

The store uses `zustand` with persistence middleware:

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // State and actions
    }),
    {
      name: 'musicfun-player',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist only volume and modes
        volume: state.volume,
        repeatMode: state.repeatMode,
        shuffleMode: state.shuffleMode,
      }),
    }
  )
)
```

## 3. State Structure

```typescript
interface Track {
  id: string
  title: string
  artist: string
  duration: number // in seconds
  url: string
  albumArt?: string
  artistId?: string
  albumId?: string
}

interface PlayerState {
  // Current playback state
  currentTrackId: string | null
  currentPlaylistId: string | null
  playbackState: 'idle' | 'playing' | 'paused' | 'loading' | 'error'

  // Playback position
  currentTime: number
  duration: number
  buffered: number // percentage 0-100

  // Volume control
  volume: number // 0-1
  isMuted: boolean

  // Playback modes
  repeatMode: 'off' | 'one' | 'all'
  shuffleMode: boolean

  // Queue management
  queue: string[] // ordered track IDs
  originalQueue: string[] // original order before shuffle
  queueIndex: number

  // Track entities - normalized storage
  tracks: Record<string, Track>

  // Error handling
  error: string | null

  // Additional metadata
  isLoadingTrack: boolean
  hasNextTrack: boolean
  hasPreviousTrack: boolean
}
```

## 4. Core Features

### 4.1 Playback Control

#### Play

- **Behavior**: Start playing the specified track or resume current track
- **Rules**:
  - If a different track is requested, stop current track and start new one from beginning
  - If same track is requested while paused, resume from current position
  - Only one track can play at a time
  - Update playback state to 'loading' then 'playing'

#### Pause

- **Behavior**: Pause current track without resetting position
- **Rules**:
  - Can only pause if a track is currently playing
  - Preserve currentTime for resume
  - Update playback state to 'paused'

### 4.2 Track Navigation

#### Next Track

- **Behavior**: Play the next track in queue
- **Rules**:
  - If repeatMode is 'one', replay current track from beginning
  - If shuffleMode is on, use shuffled queue order
  - If at end of queue:
    - If repeatMode is 'all', go to first track
    - If repeatMode is 'off', stop playback
  - Start new track from beginning

#### Previous Track

- **Behavior**: Play the previous track or restart current track
- **Rules**:
  - If currentTime > 3 seconds, restart current track from beginning
  - Otherwise, go to previous track in queue
  - If at beginning of queue:
    - If repeatMode is 'all', go to last track
    - If repeatMode is 'off', restart current track

### 4.3 Progress Tracking

#### Seek

- **Behavior**: Jump to specific position in current track
- **Rules**:
  - Validate position is within track duration
  - Update currentTime
  - Maintain current playback state (playing/paused)

#### Time Update

- **Behavior**: Sync state with Audio element time
- **Rules**:
  - Throttled updates (max 1 per 0.5s to avoid excessive re-renders)
  - Update currentTime, buffered percentage
  - Check for track end condition

### 4.4 Volume Control

#### Set Volume

- **Behavior**: Adjust playback volume
- **Rules**:
  - Clamp value between 0 and 1
  - Persist to localStorage
  - If volume > 0, unmute automatically

#### Toggle Mute

- **Behavior**: Mute/unmute audio
- **Rules**:
  - Preserve volume level when muting
  - Restore previous volume when unmuting

### 4.5 Playback Modes

#### Repeat Modes

- **off**: Play queue once and stop
- **one**: Repeat current track indefinitely
- **all**: Loop entire queue continuously

#### Shuffle Mode

- **Behavior**: Randomize playback order
- **Rules**:
  - Store original queue order in originalQueue
  - Generate shuffled queue using Fisher-Yates algorithm
  - Maintain current track position when toggling
  - When shuffle is disabled, restore original order

### 4.6 Queue Management

#### Load Playlist

- **Behavior**: Load tracks from playlist into queue
- **Rules**:
  - Replace current queue
  - Reset queue index to 0
  - Store playlist ID for reference
  - Apply shuffle if enabled
  - Start playing first track

#### Add to Queue

- **Behavior**: Append track(s) to current queue
- **Rules**:
  - Add to end of queue
  - Update originalQueue if shuffle is off
  - Don't interrupt current playback

#### Insert Next

- **Behavior**: Add track to play after current track
- **Rules**:
  - Insert at queueIndex + 1
  - Don't interrupt current playback

#### Remove from Queue

- **Behavior**: Remove track from queue
- **Rules**:
  - Adjust queueIndex if necessary
  - If removing current track, skip to next

## 5. Store Actions

### Playback Control

```typescript
play(track: Track, playlistId?: string, tracks?: Track[])
pause()
resume()
stop()
togglePlayPause()
```

### Navigation

```typescript
nextTrack()
previousTrack()
playTrackAtIndex(index: number)
handleTrackEnded()
```

### Progress

```typescript
seek(time: number)
updateTime(time: number)
updateBuffered(percentage: number)
setDuration(duration: number)
```

### Volume

```typescript
setVolume(volume: number)
toggleMute()
```

### Modes

```typescript
setRepeatMode(mode: 'off' | 'one' | 'all')
toggleShuffle()
```

### Queue

```typescript
loadPlaylist(playlistId: string, tracks: Track[], startIndex?: number)
addToQueue(tracks: Track[])
insertNext(track: Track)
removeFromQueue(index: number)
clearQueue()
```

### Error Handling

```typescript
setError(error: string)
clearError()
```

## 6. Performance Optimization

### 6.1 Atomic Selection Pattern

The store uses atomic state selection to minimize re-renders. Hooks subscribe only to specific primitives, and complex objects are memoized using `useMemo`.

```typescript
// Hook example using atomic selection
export function usePlaybackState() {
  const isPlaying = usePlayerStore((state) => state.playbackState === 'playing')
  const playbackState = usePlayerStore((state) => state.playbackState)

  return { isPlaying, playbackState }
}
```

### 6.2 Track List Optimization

**Problem**: With hundreds of tracks on page, we need to avoid re-rendering all track components when only one track's state changes or when `currentTime` updates.

**Solution**: Use track-specific hooks that perform checks inside the selector.

```typescript
// In player-track-hooks.ts
export function useTrackPlaybackState(trackId: string): TrackPlaybackState {
  return usePlayerStore((state) => ({
    isCurrentTrack: state.currentTrackId === trackId,
    isPlaying: state.currentTrackId === trackId && state.playbackState === 'playing',
    // ...
  }))
}
```

### 6.3 Component Optimization

- Wrap track components in `React.memo`
- Use track-specific selectors to prevent unnecessary re-renders
- Only subscribe to state slices that component needs

### 6.4 Time Update Throttling

The AudioManager throttles timeupdate events to avoid excessive state updates:

```typescript
private bindEvents() {
  this.audio.addEventListener('timeupdate', () => {
    const currentTime = this.audio.currentTime
    // Throttle to max 1 update per 0.5 seconds
    if (Math.abs(currentTime - this.lastTimeUpdate) > 0.5) {
      this.lastTimeUpdate = currentTime
      this.emit('timeupdate', currentTime)
    }
  })
}
```

## 7. Audio Integration

### 7.1 Audio Manager

The AudioManager is a singleton that wraps the browser's Audio API:

```typescript
class AudioManager {
  private static instance: AudioManager
  private audio: HTMLAudioElement
  private listeners: Map<AudioEvent, Set<Function>> = new Map()

  static get(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  on<K>(event: K, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off<K>(event: K, callback: (data: any) => void) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(callback)
    }
  }

  async loadTrack(track: Track): Promise<void> {
    if (this.audio.src !== track.url) {
      this.audio.src = track.url
      if (this.audio.readyState >= 2) {
        return Promise.resolve()
      }
      return new Promise((resolve, reject) => {
        const onCanPlay = () => {
          this.off('canplay', onCanPlay)
          this.off('error', onError)
          resolve()
        }
        const onError = () => {
          this.off('canplay', onCanPlay)
          this.off('error', onError)
          reject(new Error('Failed to load track'))
        }
        this.on('canplay', onCanPlay)
        this.on('error', onError)
      })
    }
  }
}

export const audioManager = AudioManager.get()
```

### 7.2 Audio Event Listeners

The store subscribes to `audioManager` events to update state:

```typescript
audioManager.on('timeupdate', (time) => {
  usePlayerStore.setState({ currentTime: time })
})

audioManager.on('loadedmetadata', ({ duration }) => {
  usePlayerStore.setState({ duration, isLoadingTrack: false })
})

audioManager.on('ended', () => {
  usePlayerStore.getState().handleTrackEnded()
})

audioManager.on('error', (error) => {
  usePlayerStore.setState({ playbackState: 'error', error })
})

audioManager.on('waiting', () => {
  usePlayerStore.setState({ isLoadingTrack: true })
})

audioManager.on('canplay', () => {
  usePlayerStore.setState({ isLoadingTrack: false })
})
```

## 8. Component Integration Examples

### 8.1 Track Item Component (in list of hundreds)

```typescript
import { useTrackPlayer } from '@/player'
import type { Track } from '@/player'

interface TrackItemProps {
  track: Track
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  // This hook only causes re-render when THIS track's state changes
  const { isPlaying, isPaused, isCurrentTrack, progress, togglePlayPause } =
    useTrackPlayer(track)

  return (
    <div className="track-item">
      <button onClick={togglePlayPause}>{isPlaying ? '⏸' : '▶'}</button>
      <span>{track.title}</span>
      {isCurrentTrack && <ProgressBar progress={progress} />}
    </div>
  )
}

export default React.memo(TrackItem)
```

### 8.2 Player Controls Component

```typescript
import { usePlayerControls, usePlaybackState, useCurrentTrack, useTrackNavigation, useVolumeControl, usePlaybackModes } from '@/player'

function PlayerControls() {
  const { togglePlayPause, setVolume, toggleMute } = usePlayerControls()
  const { isPlaying, isLoading, error } = usePlaybackState()
  const { track } = useCurrentTrack()
  const { next, previous, hasNext, hasPrevious } = useTrackNavigation()
  const { volume, isMuted } = useVolumeControl()
  const { repeatMode, shuffleMode, cycleRepeatMode, toggleShuffle } = usePlaybackModes()

  return (
    <div className="player-controls">
      <button onClick={previous} disabled={!hasPrevious}>
        ⏮
      </button>

      <button onClick={togglePlayPause} disabled={isLoading}>
        {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
      </button>

      <button onClick={next} disabled={!hasNext}>
        ⏭
      </button>

      <button onClick={toggleShuffle} className={shuffleMode ? 'active' : ''}>
        🔀
      </button>

      <button onClick={cycleRepeatMode}>
        {repeatMode === 'one' ? '🔂' : repeatMode === 'all' ? '🔁' : '↻'}
      </button>

      <button onClick={toggleMute}>{isMuted ? '🔇' : '🔊'}</button>
      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />

      {track && (
        <div className="now-playing">
          <img src={track.albumArt} alt="" />
          <div>
            <div>{track.title}</div>
            <div>{track.artist}</div>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 8.3 Progress Bar Component

```typescript
import { usePlaybackProgress, usePlayerControls } from '@/player'

function ProgressBar() {
  const { currentTime, duration, progress, formattedTime } = usePlaybackProgress()
  const { seek } = usePlayerControls()

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    seek(percentage * duration)
  }

  return (
    <div className="progress-bar-container">
      <span>{formattedTime.current}</span>
      <div className="progress-bar" onClick={handleSeek}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span>{formattedTime.duration}</span>
    </div>
  )
}
```

### 8.4 Playlist Component

```typescript
import { useQueueControls } from '@/player'
import type { Track } from '@/player'

function PlaylistView({ playlistId, tracks }: { playlistId: string; tracks: Track[] }) {
  const { loadPlaylist } = useQueueControls()

  const handlePlayAll = () => {
    loadPlaylist(playlistId, tracks, 0)
  }

  return (
    <div>
      <h2>Playlist</h2>
      <button onClick={handlePlayAll}>Play All</button>
      <div className="track-list">
        {tracks.map((track) => (
          <TrackItem key={track.id} track={track} />
        ))}
      </div>
    </div>
  )
}
```

## 9. Persistence

The player automatically persists to localStorage:

- Volume level
- Repeat mode
- Shuffle mode

```typescript
const initialState = {
  volume: loadPersistedVolume(),
  repeatMode: loadPersistedRepeatMode(),
  shuffleMode: loadPersistedShuffle(),
}

// Persistence helpers
function loadPersistedVolume(): number {
  try {
    const volume = localStorage.getItem('player_volume')
    return volume ? parseFloat(volume) : 1
  } catch {
    return 1
  }
}
```

## 10. Error Handling

Errors are automatically captured and stored in state:

```typescript
const { error } = usePlaybackState()

if (error) {
  return <ErrorMessage message={error} />
}
```

## 11. Keyboard Shortcuts

Enable keyboard controls in your main App component:

```typescript
import { usePlayerKeyboardControls } from '@/player'

function App() {
  usePlayerKeyboardControls(true)
  return <YourApp />
}
```

**Available shortcuts:**

- `Space` - Play/Pause
- `Arrow Right` - Seek forward 5s
- `Arrow Left` - Seek backward 5s
- `Arrow Up` - Volume up
- `Arrow Down` - Volume down
- `M` - Toggle mute
- `N` - Next track
- `P` - Previous track

## 12. Performance Metrics

- Zero unnecessary re-renders of non-playing tracks
- < 100ms response time for play/pause actions
- < 50ms for progress bar updates
- Support 1000+ tracks in UI without performance degradation
- < 1s time to start playing track after selection
- Smooth 60fps animations for progress bars

## 13. API Contract

### Track Type

```typescript
interface Track {
  id: string // Required - unique track identifier
  title: string // Required - track title
  artist: string // Required - artist name
  url: string // Required - audio file URL (THIS IS CRITICAL!)
  duration: number // Required - duration in seconds

  // Optional fields
  album?: string // Album name
  albumArt?: string // Cover image URL
  artistId?: string // Artist ID for navigation
  albumId?: string // Album ID for navigation
}
```

### Playlist Type

```typescript
interface Playlist {
  id: string
  name: string
  description?: string
  trackIds: string[]
  createdAt: string
  updatedAt: string
  coverImage?: string
}
```

## 14. Future Enhancements

- Media Session API integration
- Gapless playback with preloading
- Crossfade between tracks
- Audio effects (equalizer, bass boost)
- Playback speed control
