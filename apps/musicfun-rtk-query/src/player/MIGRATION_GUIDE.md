# Player API Migration Guide

The player has been refactored to be independent of RTK Query cache. It now stores full track information internally, making it more reliable and decoupled from the API layer.

## Breaking Changes

### 1. Actions Now Accept Full Track Objects

**Before:**

```typescript
// Old API - just IDs
dispatch(playTrack({ trackId: '123' }))
dispatch(loadPlaylist({ playlistId: 'playlist-1', trackIds: ['1', '2', '3'] }))
dispatch(addToQueue(['track-1', 'track-2']))
dispatch(insertNext('track-3'))
```

**After:**

```typescript
// New API - full track objects
import type { Track } from '@/player'

const track: Track = {
  id: '123',
  title: 'Song Title',
  artist: 'Artist Name',
  url: 'https://example.com/audio.mp3', // Required!
  duration: 180, // in seconds
  albumArt: 'https://example.com/cover.jpg', // optional
  album: 'Album Name', // optional
  artistId: 'artist-1', // optional
  albumId: 'album-1', // optional
}

dispatch(playTrack({ track }))

// With playlist context
const tracks: Track[] = [
  /* array of track objects */
]
dispatch(
  playTrack({
    track,
    playlistId: 'playlist-1',
    tracks, // All tracks in the playlist
  })
)

// Load entire playlist
dispatch(
  loadPlaylist({
    playlistId: 'playlist-1',
    tracks: tracks, // Array of Track objects
    startIndex: 0, // Optional
  })
)

// Queue operations
dispatch(addToQueue(tracks))
dispatch(insertNext(track))
```

### 2. Hooks Signature Changes

**Before:**

```typescript
const { play } = usePlayerControls()
play('track-123')

const trackPlayer = useTrackPlayer('track-123')

const { loadPlaylist } = useQueueControls()
loadPlaylist('playlist-1', ['track-1', 'track-2'])
```

**After:**

```typescript
import type { Track } from '@/player'

const { play } = usePlayerControls()
play(track, 'playlist-1', tracks)

const trackPlayer = useTrackPlayer(track) // Pass full track object

const { loadPlaylist } = useQueueControls()
loadPlaylist('playlist-1', tracks) // Array of Track objects
```

## How to Convert Your API Data to Track Objects

### Example: Converting from RTK Query Response

```typescript
import { useFetchTracksQuery } from '@/features/tracks/api'
import { usePlayerControls } from '@/player'
import type { Track } from '@/player'

function TracksList() {
  const { data } = useFetchTracksQuery()
  const { play } = usePlayerControls()

  // Helper function to convert API track to Player track
  const convertToPlayerTrack = (apiTrack: any): Track => ({
    id: apiTrack.id,
    title: apiTrack.attributes.title,
    artist: apiTrack.attributes.artists?.[0]?.name || 'Unknown Artist',
    album: apiTrack.attributes.album?.name,
    duration: apiTrack.attributes.duration,
    url: apiTrack.attributes.attachments?.[0]?.url, // Audio file URL
    albumArt: apiTrack.attributes.images?.medium || apiTrack.attributes.images?.small,
    artistId: apiTrack.attributes.artists?.[0]?.id,
  })

  const handlePlay = (apiTrack: any) => {
    const track = convertToPlayerTrack(apiTrack)

    // Option 1: Play single track
    play(track)

    // Option 2: Play with playlist context
    const allTracks = data?.data.map(convertToPlayerTrack) || []
    play(track, 'all-tracks', allTracks)
  }

  return (
    <div>
      {data?.data.map(apiTrack => (
        <div key={apiTrack.id}>
          <button onClick={() => handlePlay(apiTrack)}>Play</button>
          <span>{apiTrack.attributes.title}</span>
        </div>
      ))}
    </div>
  )
}
```

### Example: Load Playlist

```typescript
import { useFetchPlaylistTracksQuery } from '@/features/tracks/api'
import { useQueueControls } from '@/player'
import type { Track } from '@/player'

function PlaylistView({ playlistId }: { playlistId: string }) {
  const { data } = useFetchPlaylistTracksQuery({ playlistId })
  const { loadPlaylist } = useQueueControls()

  const handlePlayAll = () => {
    if (!data?.data) return

    const tracks: Track[] = data.data.map(apiTrack => ({
      id: apiTrack.id,
      title: apiTrack.attributes.title,
      artist: apiTrack.attributes.artists?.[0]?.name || 'Unknown',
      url: apiTrack.attributes.attachments?.[0]?.url,
      duration: apiTrack.attributes.duration,
      albumArt: apiTrack.attributes.images?.small,
    }))

    loadPlaylist(playlistId, tracks, 0)
  }

  return (
    <div>
      <button onClick={handlePlayAll}>Play All</button>
    </div>
  )
}
```

### Example: Using useTrackPlayer Hook

```typescript
import { useTrackPlayer } from '@/player'
import type { Track } from '@/player'

// Create track object from your API data
function TrackCard({ apiTrack }: { apiTrack: any }) {
  const track: Track = {
    id: apiTrack.id,
    title: apiTrack.attributes.title,
    artist: apiTrack.attributes.artists?.[0]?.name || 'Unknown',
    url: apiTrack.attributes.attachments?.[0]?.url,
    duration: apiTrack.attributes.duration,
    albumArt: apiTrack.attributes.images?.small,
  }

  const { isPlaying, togglePlayPause, progress } = useTrackPlayer(track)

  return (
    <div>
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <h3>{track.title}</h3>
      {isPlaying && <ProgressBar progress={progress} />}
    </div>
  )
}
```

## Track Type Definition

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

## Important Notes

1. **`url` field is REQUIRED**: The player needs the audio file URL to play tracks. Make sure your track objects include this.

2. **Track data is stored in player state**: Once you pass tracks to the player, they're stored internally. The player no longer depends on RTK Query cache.

3. **Performance**: The player uses normalized storage (tracks by ID) for optimal performance.

4. **Queue operations**: When you add tracks to queue or load playlists, all track data must be provided upfront.

## Migration Checklist

- [ ] Update all `playTrack` calls to pass full `Track` object
- [ ] Update all `loadPlaylist` calls to pass `Track[]` instead of `string[]`
- [ ] Update all `addToQueue` calls to pass `Track[]`
- [ ] Update all `insertNext` calls to pass `Track` object
- [ ] Update `useTrackPlayer` to pass full `Track` object
- [ ] Create helper functions to convert your API responses to `Track` objects
- [ ] Ensure all tracks have valid `url` fields pointing to audio files
- [ ] Test playback with the new API

## Files to Update in Your Codebase

Based on the build errors, update these files:

1. **src/features/tracks/ui/TrackInfoCell/TrackInfoCell.tsx** (line 29)

   - Update to pass full track object with URL

2. **src/pages/TracksPage/TracksPage.tsx** (line 38)
   - Update loadPlaylist call to pass track objects array

## Need Help?

If you're unsure about any part of the migration, check:

- `src/player/README.md` - Usage examples
- `src/player/SPECIFICATION.md` - Complete technical specification
- `src/player/types/player.types.ts` - Type definitions
