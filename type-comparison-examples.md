# Type Comparison Examples

## RTK-Query API Track Example

From `rtk-query`: `export type ApiTrack = TrackDetails<FetchTracksAttributes>`
BaseAttributes + FetchTracksAttributes specific fields

```typescript
const rtkQueryApiTrack = {
  id: '1',
  type: 'tracks' as const,
  attributes: {
    // BaseAttributes fields
    title: 'Days That Matter',
    addedAt: '2025-06-01T12:00:00Z',
    attachments: [
      {
        id: 'att1',
        addedAt: '2025-06-01T12:00:00Z',
        updatedAt: '2025-06-01T12:00:00Z',
        version: 1,
        url: 'https://example.com/audio.mp3',
        contentType: 'audio/mpeg',
        originalName: 'track.mp3',
        originalKey: 'uploads/track.mp3',
        fileSize: 3487234,
      },
    ],
    images: {
      main: [
        {
          type: 'original' as const,
          width: 100,
          height: 100,
          fileSize: 0,
          url: 'https://unsplash.it/110/110',
        },
      ],
    },
    currentUserReaction: 0, // 0 - none, 1 - like, -1 - dislike
    dislikesCount: 2,
    likesCount: 104,

    // FetchTracksAttributes specific
    user: {
      id: '1',
      name: 'John Doe',
    },
  },
  relationships: {
    artists: {
      data: [
        {
          id: '1',
          type: 'artists' as const,
        },
      ],
    },
  },
}
```

---

## Tanstack-Query-Zustand TrackListItemOutput Example

```typescript
const tanstackTrackListItemOutput = {
  id: '1',
  type: 'tracks',
  attributes: {
    title: 'Days That Matter',
    addedAt: '2025-06-01T12:00:00Z',
    likesCount: 104,
    attachments: [
      {
        id: 'att1',
        addedAt: '2025-06-01T12:00:00Z',
        updatedAt: '2025-06-01T12:00:00Z',
        version: 1,
        url: 'https://example.com/audio.mp3',
        contentType: 'audio/mpeg',
        originalName: 'track.mp3',
        fileSize: 3487234,
      },
    ],
    images: {
      main: [
        {
          type: 'original',
          width: 100,
          height: 100,
          fileSize: 0,
          url: 'https://unsplash.it/110/110',
        },
      ],
    },
    user: {
      id: '1',
      name: 'John Doe',
    },
    currentUserReaction: 0, // ReactionValue enum
    isPublished: true,
    publishedAt: '2025-06-01T12:00:00Z',
  },
  relationships: {
    artists: {
      data: [
        {
          id: '1',
          type: 'artists',
        },
      ],
    },
  },
}
```

---

## Tanstack-Query-Zustand TrackDetailsData Example

```typescript
const tanstackTrackDetailsData = {
  id: '1',
  type: 'tracks',
  attributes: {
    title: 'Days That Matter',
    lyrics: 'Some lyrics text here...',
    releaseDate: '2025-06-01T12:00:00Z',
    addedAt: '2025-06-01T12:00:00Z',
    updatedAt: '2025-06-01T12:00:00Z',
    duration: 245, // seconds
    likesCount: 104,
    dislikesCount: 2,
    attachments: [
      {
        id: 'att1',
        addedAt: '2025-06-01T12:00:00Z',
        updatedAt: '2025-06-01T12:00:00Z',
        version: 1,
        url: 'https://example.com/audio.mp3',
        contentType: 'audio/mpeg',
        originalName: 'track.mp3',
        fileSize: 3487234,
      },
    ],
    images: {
      main: [
        {
          type: 'original',
          width: 100,
          height: 100,
          fileSize: 0,
          url: 'https://unsplash.it/110/110',
        },
      ],
    },
    tags: [
      {
        id: 'tag1',
        name: 'Rock',
      },
    ],
    artists: [
      {
        id: '1',
        name: 'John Doe',
      },
    ],
    user: {
      id: '1',
      name: 'John Doe',
    },
    isPublished: true,
    publishedAt: '2025-06-01T12:00:00Z',
    currentUserReaction: 0, // ReactionValue enum
  },
  // NOTE: TrackDetailsData has NO relationships field!
}
```

---

## Comparison Analysis

### Key Differences

1. **Relationships Field:**

   - **rtk-query:** Has `relationships.artists` field
   - **tanstack TrackListItemOutput:** Has `relationships.artists` field
   - **tanstack TrackDetailsData:** **NO** relationships field at all!

2. **Artist Information:**

   - **rtk-query:** Only relationship ID, needs separate fetch for artist details
   - **tanstack TrackListItemOutput:** Only relationship ID
   - **tanstack TrackDetailsData:** Embedded `artists` array with name!

3. **Additional Fields in TrackDetailsData:**

   - `lyrics`: `string | null`
   - `releaseDate`: `string | null`
   - `updatedAt`: `string` (vs `addedAt` only in list items)
   - `duration`: `number` (vs no duration in list items)
   - `tags`: array of tag objects
   - `isPublished`: `boolean`
   - `publishedAt`: `string | null`

4. **Current User Reaction:**

   - **rtk-query:** `number` (0, 1, -1)
   - **tanstack:** enum type `ReactionValue` (0, 1, -1)

5. **Attachment Structure:**

   - **rtk-query:** Has `originalKey` field
   - **tanstack:** No `originalKey` field

6. **Enum Values:**
   - **rtk-query:** String literals (`'tracks'`, `'artists'`)
   - **tanstack:** Mixed - string literals and enum values

### Conclusion

My original union type approach was **CORRECT** because:

- `TrackDetailsData` has completely different structure (no relationships)
- `TrackDetailsData` has embedded artist info instead of relationships
- Need different handling logic for each format
