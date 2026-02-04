# Music Player - Business Logic

This folder contains the complete business logic for the music player, implemented with Zustand.

## Setup

### 1. Initialize Player

Import and call the initialization function once in your app (e.g., in `main.tsx`):

```typescript
// src/main.tsx
import { initializePlayer } from '@/player'

initializePlayer()
```

You can also clean up listeners when needed (e.g., in tests or hot reload):

```typescript
import { cleanupPlayer } from '@/player'

cleanupPlayer()
```

### 2. Basic Usage in Components

#### Simple Track Item Component

```tsx
import { useTrackPlayer } from '@/player'

function TrackItem({ track }: { track: Track }) {
  const { isPlaying, isPaused, isCurrentTrack, progress, togglePlayPause } = useTrackPlayer(track)

  return (
    <div className="track-item">
      <button onClick={togglePlayPause}>{isPlaying ? '⏸' : '▶'}</button>

      {/* Only show progress bar for current track */}
      {isCurrentTrack && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}
```

#### Player Controls Component

```tsx
import { usePlayerControls, usePlaybackState, useCurrentTrack, useTrackNavigation } from '@/player'

function PlayerControls() {
  const { togglePlayPause } = usePlayerControls()
  const { isPlaying } = usePlaybackState()
  const { track } = useCurrentTrack()
  const { next, previous, hasNext, hasPrevious } = useTrackNavigation()

  return (
    <div className="player-controls">
      <button onClick={previous} disabled={!hasPrevious}>
        ⏮
      </button>
      <button onClick={togglePlayPause}>{isPlaying ? '⏸' : '▶'}</button>
      <button onClick={next} disabled={!hasNext}>
        ⏭
      </button>

      {track && (
        <div className="now-playing">
          <span>{track.title}</span>
        </div>
      )}
    </div>
  )
}
```

#### Progress Bar Component

```tsx
import { usePlaybackProgress, usePlayerControls } from '@/player'

function ProgressBar() {
  const { currentTime, duration, progress, formattedTime } = usePlaybackProgress()
  const { seek } = usePlayerControls()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    seek(percentage * duration)
  }

  return (
    <div className="progress-container">
      <span>{formattedTime.current}</span>
      <div className="progress-bar" onClick={handleClick}>
        <div style={{ width: `${progress}%` }} />
      </div>
      <span>{formattedTime.duration}</span>
    </div>
  )
}
```

#### Volume Control Component

```tsx
import { useVolumeControl, usePlayerControls } from '@/player'

function VolumeControl() {
  const { volume, isMuted, volumePercentage } = useVolumeControl()
  const { setVolume, toggleMute } = usePlayerControls()

  return (
    <div className="volume-control">
      <button onClick={toggleMute}>{isMuted ? '🔇' : '🔊'}</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
  )
}
```

#### Playback Modes Component

```tsx
import { usePlaybackModes } from '@/player'

function PlaybackModes() {
  const { repeatMode, shuffleMode, cycleRepeatMode, toggleShuffle } = usePlaybackModes()

  return (
    <div className="playback-modes">
      <button onClick={toggleShuffle} className={shuffleMode ? 'active' : ''}>
        🔀
      </button>

      <button onClick={cycleRepeatMode}>
        {repeatMode === 'one' ? '🔂' : repeatMode === 'all' ? '🔁' : '↻'}
      </button>
    </div>
  )
}
```

#### Playlist Component

```tsx
import { useQueueControls } from '@/player'
import type { Track } from '@/player'

function PlaylistView({ playlistId, tracks }: { playlistId: string; tracks: Track[] }) {
  const { loadPlaylist } = useQueueControls()

  const handlePlayAll = () => {
    loadPlaylist(playlistId, tracks, 0)
  }

  return (
    <div>
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

## Available Hooks

### Core Hooks

- **`usePlayer()`** - All-in-one hook with complete player functionality
- **`usePlayerControls()`** - Play, pause, stop, seek, navigation, volume and mute controls
- **`usePlaybackState()`** - Current playback state (playing, paused, loading, etc.)
- **`useCurrentTrack()`** - Current playing track information
- **`usePlaybackProgress()`** - Time, duration, progress percentage
- **`usePlayingTrackProgress()`** - Current track progress (shorthand)

### Track-Specific Hooks (Performance Optimized)

- **`useTrackPlayer(track)`** - Complete player state and controls for specific track
- **`useTrackPlaybackState(trackId)`** - Playback state for specific track
- **`useTrackProgress(trackId)`** - Progress for specific track (only if current)
- **`useIsCurrentTrack(trackId)`** - Check if track is currently playing
- **`useTrackQueuePosition(trackId)`** - Track's position in queue

### Feature-Specific Hooks

- **`useVolumeControl()`** - Volume and mute state (read-only)
- **`usePlayerQueue()`** - Queue state and manipulation
- **`usePlaybackModes()`** - Repeat and shuffle modes
- **`useTrackNavigation()`** - Next/previous track navigation
- **`useSetRepeatMode()`** - Set specific repeat mode
- **`useCycleRepeatMode()`** - Cycle through repeat modes
- **`useToggleShuffle()`** - Toggle shuffle on/off
- **`usePlayerKeyboardControls()`** - Enable keyboard shortcuts

## Store Actions

### Playback Control

```typescript
import { usePlayerStore } from '@/player'

const { play, pause, resume, stop, togglePlayPause } = usePlayerStore.getState()

play(track, playlistId?, tracks?)
pause()
resume()
stop()
togglePlayPause()
```

### Navigation

```typescript
const { nextTrack, previousTrack, playTrackAtIndex } = usePlayerStore.getState()

nextTrack()
previousTrack()
playTrackAtIndex(index)
```

### Progress

```typescript
const { seek } = usePlayerStore.getState()

seek(timeInSeconds)
```

### Volume

```typescript
const { setVolume, toggleMute } = usePlayerStore.getState()

setVolume(0.5) // 0-1
toggleMute()
```

### Modes

```typescript
const { setRepeatMode, toggleShuffle } = usePlayerStore.getState()

setRepeatMode('off' | 'one' | 'all')
toggleShuffle()
```

### Queue

```typescript
const { loadPlaylist, addToQueue, insertNext, removeFromQueue, clearQueue } = usePlayerStore.getState()

loadPlaylist(playlistId, tracks, startIndex?)
addToQueue([track1, track2])
insertNext(track)
removeFromQueue(index)
clearQueue()
```

## Performance Considerations

### Track List Optimization

When rendering lists of tracks, use track-specific hooks to prevent unnecessary re-renders. These hooks are optimized with `useMemo` and atomic state selection.

```tsx
// ✅ Good - only re-renders when THIS track's state changes
function TrackItem({ track }) {
  const { isPlaying, isCurrentTrack } = useTrackPlayer(track)
  // ...
}

// ❌ Bad - re-renders on any player state change (like currentTime updating)
function TrackItem({ track }) {
  const state = usePlayerStore()
  const isPlaying = state.currentTrackId === track.id && state.playbackState === 'playing'
  // ...
}
```

### Component Memoization

Wrap track components in `React.memo` to ensure they only re-render when their props (like the `track` object) or the hooks they use trigger an update.

```tsx
export default React.memo(TrackItem)
```

## File Structure

```
src/player/
├── index.ts                  # Main exports
├── README.md                 # This file
├── task.md                   # Original task specification
├── model/
│   ├── player-store.ts       # Zustand store with all state and actions
│   ├── player-track-hooks.ts # Track-specific hooks (performance critical)
│   ├── player-hooks.ts       # Global React hooks
│   ├── audio-manager.ts      # Singleton Audio wrapper
│   └── utils/
│       ├── index.ts          # Utils exports
│       ├── shuffle.ts        # Shuffle algorithms
│       ├── format-time.ts    # Time formatting
│       ├── track-navigation.ts # Queue navigation logic
│       └── convert-api-track-to-player-track.ts # API mappers
└── types/
    └── player.types.ts       # TypeScript types
```

## Persistence

The player automatically persists to localStorage:

- Volume level
- Repeat mode
- Shuffle mode

These values are restored on page reload.

## Error Handling

Errors are automatically captured and stored in state:

```tsx
const { error } = usePlaybackState()

if (error) {
  return <ErrorMessage message={error} />
}
```

## Audio Manager

The `AudioManager` is a singleton that wraps the browser's `Audio` API:

```typescript
import { audioManager } from '@/player'

audioManager.loadTrack(track)
audioManager.play()
audioManager.pause()
audioManager.seek(time)
audioManager.setVolume(volume)
audioManager.setMuted(muted)

// Event listeners
audioManager.on('timeupdate', (time) => {})
audioManager.on('ended', () => {})
audioManager.on('error', (error) => {})
audioManager.on('loadedmetadata', ({ duration }) => {})
```

## Track Types

```typescript
interface Track {
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
```

## Queue Management

The player supports a full queue system:

- **Original Queue**: Preserves original track order
- **Shuffle Queue**: Randomized order when shuffle is enabled
- **Queue Position**: Current index in the queue

When shuffle is toggled, the queue is automatically reorganized while keeping the current track at the current position.

## Keyboard Shortcuts

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
