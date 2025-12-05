# Music Player Redux Slice - Technical Specification

## 1. Overview

This specification defines a Redux Toolkit slice that wraps the HTML5 Audio API to create a fully-featured music player with playlist support, multiple playback modes, and performance-optimized state management.

## 2. State Structure

```typescript
interface Track {
  id: string
  title: string
  artist: string
  duration: number // in seconds
  url: string
  albumArt?: string
}

interface Playlist {
  id: string
  name: string
  trackIds: string[]
}

interface PlayerState {
  // Current playback state
  currentTrackId: string | null
  currentPlaylistId: string | null
  playbackState: 'idle' | 'playing' | 'paused' | 'loading' | 'error'

  // Playback position
  currentTime: number // in seconds
  duration: number // in seconds
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

  // Error handling
  error: string | null

  // Additional metadata
  isLoadingTrack: boolean
  hasNextTrack: boolean
  hasPreviousTrack: boolean
}
```

## 3. Core Features

### 3.1 Playback Control

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

### 3.2 Track Navigation

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

### 3.3 Progress Tracking

#### Seek

- **Behavior**: Jump to specific position in current track
- **Rules**:
  - Validate position is within track duration
  - Update currentTime
  - Maintain current playback state (playing/paused)

#### Time Update

- **Behavior**: Sync Redux state with Audio element time
- **Rules**:
  - Throttled updates (max 1 per second to avoid excessive rerenders)
  - Update currentTime, buffered percentage
  - Check for track end condition

### 3.4 Volume Control

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

### 3.5 Playback Modes

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

### 3.6 Queue Management

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

## 4. Redux Actions

```typescript
// Playback control
playTrack(trackId: string, playlistId?: string)
pause()
resume()
stop()
togglePlayPause()

// Navigation
nextTrack()
previousTrack()
playTrackAtIndex(index: number)

// Progress
seek(time: number)
updateTime(time: number) // Internal, called by audio events
updateBuffered(percentage: number)

// Volume
setVolume(volume: number)
toggleMute()

// Modes
setRepeatMode(mode: 'off' | 'one' | 'all')
toggleShuffle()

// Queue
loadPlaylist(playlistId: string, trackIds: string[], startIndex?: number)
addToQueue(trackIds: string[])
insertNext(trackId: string)
removeFromQueue(index: number)
clearQueue()

// Error handling
setError(error: string)
clearError()

// Metadata
setDuration(duration: number)
setLoadingState(isLoading: boolean)
```

## 5. Selectors (Performance Optimized)

### 5.1 Basic Selectors

```typescript
// Simple state selectors
selectCurrentTrackId
selectPlaybackState
selectCurrentTime
selectDuration
selectVolume
selectIsMuted
selectRepeatMode
selectShuffleMode
selectQueue
selectQueueIndex
selectError
```

### 5.2 Computed Selectors

```typescript
// Memoized with createSelector
selectIsPlaying // playbackState === 'playing'
selectIsPaused // playbackState === 'paused'
selectProgress // (currentTime / duration) * 100
selectFormattedTime // { current: 'MM:SS', duration: 'MM:SS' }
selectHasNextTrack
selectHasPreviousTrack
selectCurrentTrack // full track object from tracks entity
selectQueueTracks // full track objects in queue order
```

### 5.3 Track-Specific Selectors (Performance Critical)

**Problem**: With hundreds of tracks on page, we need to avoid rerendering all track components when only one track's state changes.

**Solution**: Create parameterized selectors that only return data for specific tracks.

```typescript
// Factory function that creates a memoized selector for a specific track
const makeSelectTrackPlaybackState = () =>
  createSelector(
    [selectCurrentTrackId, selectPlaybackState, (state: RootState, trackId: string) => trackId],
    (currentTrackId, playbackState, trackId) => ({
      isCurrentTrack: currentTrackId === trackId,
      isPlaying: currentTrackId === trackId && playbackState === 'playing',
      isPaused: currentTrackId === trackId && playbackState === 'paused',
      playbackState: currentTrackId === trackId ? playbackState : 'idle',
    })
  )

// Usage in component: only rerenders when THIS track's state changes
const useTrackPlaybackState = (trackId: string) => {
  const selectTrackPlaybackState = useMemo(makeSelectTrackPlaybackState, [])
  return useSelector((state) => selectTrackPlaybackState(state, trackId))
}
```

### 5.4 Progress Selector (for current track only)

```typescript
const selectTrackProgress = createSelector(
  [
    selectCurrentTrackId,
    selectCurrentTime,
    selectDuration,
    (state: RootState, trackId: string) => trackId,
  ],
  (currentTrackId, currentTime, duration, trackId) => {
    if (currentTrackId !== trackId) return { progress: 0, currentTime: 0 }
    return {
      progress: duration > 0 ? (currentTime / duration) * 100 : 0,
      currentTime,
    }
  }
)
```

## 6. Audio Integration

### 6.1 Audio Event Listeners

Setup in middleware:

```typescript
audio.addEventListener('loadedmetadata', () => {
  dispatch(setDuration(audio.duration))
})

audio.addEventListener(
  'timeupdate',
  throttle(() => {
    dispatch(updateTime(audio.currentTime))
  }, 1000)
)

audio.addEventListener('ended', () => {
  dispatch(handleTrackEnded())
})

audio.addEventListener('error', (e) => {
  dispatch(setError(audio.error?.message || 'Playback error'))
})

audio.addEventListener('loadstart', () => {
  dispatch(setLoadingState(true))
})

audio.addEventListener('canplay', () => {
  dispatch(setLoadingState(false))
})

audio.addEventListener('progress', () => {
  if (audio.buffered.length > 0) {
    const buffered = (audio.buffered.end(0) / audio.duration) * 100
    dispatch(updateBuffered(buffered))
  }
})
```

### 6.2 Middleware for Audio Sync

Create Redux middleware to sync actions with Audio API:

```typescript
const playerMiddleware = (store) => (next) => (action) => {
  const result = next(action)
  const state = store.getState()

  switch (action.type) {
    case 'player/playTrack': {
      const track = selectTrackById(state, action.payload.trackId)
      if (track) {
        audio.src = track.url
        audio.currentTime = 0
        audio.play().catch((e) => {
          store.dispatch(setError(e.message))
        })
      }
      break
    }

    case 'player/pause':
      audio.pause()
      break

    case 'player/resume':
      audio.play().catch((e) => {
        store.dispatch(setError(e.message))
      })
      break

    case 'player/seek':
      audio.currentTime = action.payload
      break

    case 'player/setVolume':
      audio.volume = action.payload
      break

    case 'player/toggleMute':
      audio.muted = !audio.muted
      break
  }

  return result
}
```

## 7. Component Integration Examples

### 7.1 Track Item Component (in list of hundreds)

```typescript
interface TrackItemProps {
  track: Track;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  // This selector only causes rerender when THIS track's state changes
  const { isPlaying, isPaused } = useTrackPlaybackState(track.id);
  const { progress, currentTime } = useTrackProgress(track.id);
  const dispatch = useDispatch();

  const handlePlay = () => {
    if (isPlaying) {
      dispatch(pause());
    } else if (isPaused) {
      dispatch(resume());
    } else {
      dispatch(playTrack(track.id));
    }
  };

  return (
    <div className="track-item">
      <button onClick={handlePlay}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <span>{track.title}</span>
      {(isPlaying || isPaused) && (
        <ProgressBar progress={progress} currentTime={currentTime} />
      )}
    </div>
  );
};

// React.memo prevents rerenders when props don't change
export default React.memo(TrackItem);
```

### 7.2 Player Controls Component

```typescript
const PlayerControls: React.FC = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const currentTrack = useSelector(selectCurrentTrack);
  const volume = useSelector(selectVolume);
  const isMuted = useSelector(selectIsMuted);
  const repeatMode = useSelector(selectRepeatMode);
  const shuffleMode = useSelector(selectShuffleMode);
  const hasNext = useSelector(selectHasNextTrack);
  const hasPrevious = useSelector(selectHasPreviousTrack);

  return (
    <div className="player-controls">
      <button
        onClick={() => dispatch(previousTrack())}
        disabled={!hasPrevious}
      >
        ⏮
      </button>

      <button onClick={() => dispatch(togglePlayPause())}>
        {isPlaying ? '⏸' : '▶'}
      </button>

      <button
        onClick={() => dispatch(nextTrack())}
        disabled={!hasNext}
      >
        ⏭
      </button>

      <button
        onClick={() => dispatch(toggleShuffle())}
        className={shuffleMode ? 'active' : ''}
      >
        🔀
      </button>

      <button onClick={() => dispatch(setRepeatMode(
        repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
      ))}>
        {repeatMode === 'one' ? '🔂' : repeatMode === 'all' ? '🔁' : '↻'}
      </button>

      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={(v) => dispatch(setVolume(v))}
        onToggleMute={() => dispatch(toggleMute())}
      />

      {currentTrack && (
        <div className="now-playing">
          <img src={currentTrack.albumArt} alt="" />
          <div>
            <div>{currentTrack.title}</div>
            <div>{currentTrack.artist}</div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 7.3 Progress Bar Component

```typescript
const ProgressBar: React.FC = () => {
  const dispatch = useDispatch();
  const currentTime = useSelector(selectCurrentTime);
  const duration = useSelector(selectDuration);
  const progress = useSelector(selectProgress);
  const buffered = useSelector(state => state.player.buffered);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    dispatch(seek(time));
  };

  return (
    <div className="progress-bar-container">
      <span>{formatTime(currentTime)}</span>

      <div className="progress-bar" onClick={handleSeek}>
        <div
          className="buffered-bar"
          style={{ width: `${buffered}%` }}
        />
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span>{formatTime(duration)}</span>
    </div>
  );
};
```

### 7.4 Playlist Component

```typescript
const PlaylistView: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  const dispatch = useDispatch();
  const playlist = useSelector(state =>
    selectPlaylistById(state, playlistId)
  );
  const tracks = useSelector(state =>
    selectTracksByIds(state, playlist.trackIds)
  );

  const handlePlayPlaylist = () => {
    dispatch(loadPlaylist(playlistId, playlist.trackIds, 0));
  };

  return (
    <div>
      <h2>{playlist.name}</h2>
      <button onClick={handlePlayPlaylist}>Play All</button>

      <div className="track-list">
        {tracks.map(track => (
          <TrackItem key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};
```

## 8. Performance Optimizations

### 8.1 Selector Memoization

- Use `createSelector` from Reselect for all computed values
- Create selector factories for parameterized selectors (per-track state)
- Keep selectors pure and referentially stable

### 8.2 Component Optimization

- Wrap track components in `React.memo`
- Use track-specific selectors to prevent unnecessary rerenders
- Only subscribe to state slices that component needs

### 8.3 Time Update Throttling

- Throttle time updates to max 1 per second
- Consider using requestAnimationFrame for progress bar updates
- Batch multiple state updates when possible

### 8.4 Entity Normalization

- Store tracks in normalized entity format: `{ byId: {}, allIds: [] }`
- Prevents deep equality checks on large arrays
- Enables efficient lookups and updates

### 8.5 Avoid Rerendering Track Lists

```typescript
// Bad: This causes all tracks to rerender on any player state change
const tracks = useSelector((state) => state.player.queue)

// Good: Memoized selector that only changes when queue IDs change
const trackIds = useSelector(selectQueueTrackIds, shallowEqual)
```

## 9. Additional Features & Requirements

### 9.1 Persistence

- Save volume preference to localStorage
- Save repeat/shuffle mode preferences
- Option to save queue state for session recovery
- Remember last played track and position

### 9.2 Keyboard Shortcuts

- Space: Toggle play/pause
- Arrow Left: Seek backward 5s
- Arrow Right: Seek forward 5s
- Arrow Up: Volume up
- Arrow Down: Volume down
- M: Toggle mute
- N: Next track
- P: Previous track

### 9.3 Media Session API

- Integrate with browser's media session API
- Show notifications with track info
- Enable hardware media key support
- Display metadata in OS media controls

### 9.4 Crossfade (Optional Enhancement)

- Smooth transitions between tracks
- Configurable crossfade duration
- Use two Audio elements for seamless playback

### 9.5 Gapless Playback

- Preload next track in queue
- Minimize pause between tracks
- Handle different audio formats gracefully

### 9.6 Analytics & Telemetry

- Track play counts
- Track skip behavior
- Track completion rates
- User preferences and patterns

### 9.7 Error Recovery

- Retry failed track loads with exponential backoff
- Skip unplayable tracks automatically
- Show user-friendly error messages
- Fallback to next track on repeated errors

### 9.8 Loading States

- Show loading indicator for tracks
- Display buffering state
- Handle slow network conditions
- Preload album art

### 9.9 Queue Manipulation

- Drag and drop to reorder queue
- Clear queue option
- Save queue as playlist
- View queue history

### 9.10 Audio Effects (Future)

- Equalizer settings
- Playback speed control
- Audio normalization
- Bass boost

## 10. Testing Considerations

### 10.1 Unit Tests

- Test all reducer logic
- Test selector memoization
- Test playback mode transitions
- Test queue manipulation

### 10.2 Integration Tests

- Test middleware audio sync
- Test event listener handling
- Test error scenarios
- Test playlist loading

### 10.3 Performance Tests

- Measure rerender frequency with 1000+ tracks
- Profile selector performance
- Test memory usage with large queues
- Measure time update throttling effectiveness

## 11. Implementation Phases

### Phase 1: Core Playback (MVP)

- Basic play/pause/stop
- Single track playback
- Volume control
- Progress tracking

### Phase 2: Queue & Navigation

- Next/previous track
- Queue management
- Playlist support
- Track navigation

### Phase 3: Playback Modes

- Repeat modes (off/one/all)
- Shuffle mode
- Auto-play next track

### Phase 4: Performance & Polish

- Optimize selectors
- Add persistence
- Error handling
- Loading states

### Phase 5: Enhanced Features

- Keyboard shortcuts
- Media Session API
- Gapless playback
- Advanced queue manipulation

## 12. File Structure

```
src/player/
├── player.ts                 // Audio instance
├── playerSlice.ts           // Redux slice with reducers
├── playerMiddleware.ts      // Audio sync middleware
├── playerSelectors.ts       // Memoized selectors
├── playerHooks.ts          // Custom React hooks
├── utils/
│   ├── shuffle.ts          // Fisher-Yates shuffle
│   ├── formatTime.ts       // Time formatting
│   └── throttle.ts         // Throttle utility
├── components/
│   ├── PlayerControls.tsx
│   ├── ProgressBar.tsx
│   ├── VolumeControl.tsx
│   ├── TrackItem.tsx
│   └── QueueView.tsx
├── types/
│   └── player.types.ts     // TypeScript interfaces
└── __tests__/
    ├── playerSlice.test.ts
    ├── selectors.test.ts
    └── middleware.test.ts
```

## 13. API Contract

### Track Entity (from API)

```typescript
interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  url: string
  albumArt?: string
  artistId?: string
  albumId?: string
}
```

### Playlist Entity (from API)

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

## 14. Success Metrics

- Zero unnecessary rerenders of non-playing tracks
- < 100ms response time for play/pause actions
- < 50ms for progress bar updates
- Support 1000+ tracks in UI without performance degradation
- < 1s time to start playing track after selection
- Smooth 60fps animations for progress bars

---

This specification provides a complete blueprint for implementing a production-ready music player with Redux Toolkit. Focus on Phase 1-3 for core functionality, then iterate with performance optimizations and enhanced features.
