# Music Player - Business Logic

This folder contains the complete business logic for the music player, implemented with Redux Toolkit.

## Setup

### 1. Add to Redux Store

Update your store configuration to include the player slice and middleware:

```typescript
// src/app/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { playerSlice, playerMiddleware } from '@/player'

export const store = configureStore({
  reducer: {
    // ... other reducers
    [playerSlice.name]: playerSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(playerMiddleware),
  // ... other middleware
})
```

### 2. Basic Usage in Components

#### Simple Track Item Component

```tsx
import { useTrackPlayer } from '@/player'

function TrackItem({ trackId }: { trackId: string }) {
  const { isPlaying, isPaused, isCurrentTrack, progress, togglePlayPause } = useTrackPlayer(trackId)

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
          <span>{track.attributes.title}</span>
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
import { useVolumeControl } from '@/player'

function VolumeControl() {
  const { volume, isMuted, volumePercentage, setVolume, toggleMute } = useVolumeControl()

  return (
    <div className="volume-control">
      <button onClick={toggleMute}>{isMuted ? '🔇' : '🔊'}</button>
      <input
        type="range"
        min="0"
        max="100"
        value={volumePercentage}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
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

function PlaylistView({ playlistId, trackIds }: Props) {
  const { loadPlaylist } = useQueueControls()

  const handlePlayAll = () => {
    loadPlaylist(playlistId, trackIds, 0)
  }

  return (
    <div>
      <button onClick={handlePlayAll}>Play All</button>

      <div className="track-list">
        {trackIds.map((trackId) => (
          <TrackItem key={trackId} trackId={trackId} />
        ))}
      </div>
    </div>
  )
}
```

## Available Hooks

### Core Hooks

- **`usePlayer()`** - All-in-one hook with complete player functionality
- **`usePlayerControls()`** - Play, pause, stop, seek, navigation controls
- **`usePlaybackState()`** - Current playback state (playing, paused, loading, etc.)
- **`useCurrentTrack()`** - Current playing track information
- **`usePlaybackProgress()`** - Time, duration, progress percentage

### Track-Specific Hooks (Performance Optimized)

- **`useTrackPlayer(trackId)`** - Complete player state and controls for specific track
- **`useTrackPlaybackState(trackId)`** - Playback state for specific track
- **`useTrackProgress(trackId)`** - Progress for specific track (only if current)
- **`useIsCurrentTrack(trackId)`** - Check if track is currently playing
- **`useTrackQueuePosition(trackId)`** - Track's position in queue

### Feature-Specific Hooks

- **`useVolumeControl()`** - Volume and mute controls
- **`usePlayerQueue()`** - Queue state and manipulation
- **`usePlaybackModes()`** - Repeat and shuffle modes
- **`useTrackNavigation()`** - Next/previous track navigation
- **`usePlayerKeyboardControls()`** - Enable keyboard shortcuts

## Actions

### Playback Control

```typescript
dispatch(playTrack({ trackId, playlistId?, queue? }))
dispatch(pause())
dispatch(resume())
dispatch(stop())
dispatch(togglePlayPause())
```

### Navigation

```typescript
dispatch(nextTrack())
dispatch(previousTrack())
dispatch(playTrackAtIndex(index))
```

### Progress

```typescript
dispatch(seek(timeInSeconds))
```

### Volume

```typescript
dispatch(setVolume(0.5)) // 0-1
dispatch(toggleMute())
```

### Modes

```typescript
dispatch(setRepeatMode('off' | 'one' | 'all'))
dispatch(toggleShuffle())
```

### Queue

```typescript
dispatch(loadPlaylist({ playlistId, trackIds, startIndex? }))
dispatch(addToQueue(['trackId1', 'trackId2']))
dispatch(insertNext('trackId'))
dispatch(removeFromQueue(index))
dispatch(clearQueue())
```

## Selectors

All selectors are memoized for optimal performance. Use selector factories for track-specific state:

```typescript
import { makeSelectTrackPlaybackState } from '@/player'

// In component:
const selectTrackState = useMemo(makeSelectTrackPlaybackState, [])
const trackState = useSelector((state) => selectTrackState(state, trackId))
```

## Performance Considerations

### Track List Optimization

When rendering lists of tracks, use track-specific hooks to prevent unnecessary rerenders:

```tsx
// ✅ Good - only rerenders when this track's state changes
function TrackItem({ trackId }) {
  const { isPlaying } = useTrackPlaybackState(trackId)
  // ...
}

// ❌ Bad - rerenders on any player state change
function TrackItem({ trackId }) {
  const currentTrackId = useSelector(selectCurrentTrackId)
  const isPlaying = currentTrackId === trackId
  // ...
}
```

### Component Memoization

Wrap track components in `React.memo`:

```tsx
export default React.memo(TrackItem)
```

## Keyboard Shortcuts

Enable keyboard controls in your main App component:

```tsx
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

## File Structure

```
src/player/
├── index.ts                 # Main exports
├── player.ts                # Audio instance
├── playerSlice.ts          # Redux slice
├── playerMiddleware.ts     # Audio sync middleware
├── playerSelectors.ts      # Memoized selectors
├── playerHooks.ts          # Custom React hooks
├── types/
│   └── player.types.ts     # TypeScript types
└── utils/
    ├── shuffle.ts          # Shuffle algorithms
    ├── formatTime.ts       # Time formatting
    ├── throttle.ts         # Throttle/debounce
    └── index.ts            # Utils exports
```

## Additional Features

### Persistence

The player automatically persists:

- Volume level
- Repeat mode
- Shuffle mode

To localStorage for session recovery.

### Error Handling

Errors are automatically captured and stored in state:

```tsx
const { error } = usePlaybackState()

if (error) {
  return <ErrorMessage message={error} />
}
```

## Next Steps

1. Integrate player slice into your Redux store
2. Add player middleware
3. Create player UI components using the provided hooks
4. Customize styling to match your design
5. Add keyboard shortcuts support
6. Implement Media Session API for OS-level controls (see SPECIFICATION.md)

For complete implementation details, see [SPECIFICATION.md](./SPECIFICATION.md).
