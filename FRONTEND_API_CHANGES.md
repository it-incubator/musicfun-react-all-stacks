# Frontend API Changes - January 27-29, 2026

This document summarizes the API changes from the last 5 commits that require frontend updates.

---

## Table of Contents

1. [New Endpoints](#new-endpoints)
2. [Response Format Changes](#response-format-changes)
3. [Request Payload Changes (Breaking)](#request-payload-changes-breaking)

---

## New Endpoints

### 1. Get Playlists Count

**Endpoint:** `GET /playlists/count/:userId`

Returns the total number of playlists for a specific user.

**Response:**

```json
{
  "count": 5
}
```

**TypeScript Interface:**

```typescript
interface GetPlaylistsCountOutput {
  count: number
}
```

---

### 2. Get Tracks Count

**Endpoint:** `GET /playlists/tracks/count/:userId`

Returns the total number of **published** tracks for a specific user.

**Response:**

```json
{
  "count": 12
}
```

**TypeScript Interface:**

```typescript
interface GetTracksCountOutput {
  count: number
}
```

> **Note:** Only published tracks are counted. Draft/unpublished tracks are excluded.

---

## Response Format Changes

### 1. Playlists List - `description` Field Removed

**Endpoint:** `GET /playlists`

The `description` field has been **removed** from the playlist list response.

**Before:**

```json
{
  "data": [
    {
      "id": "...",
      "type": "playlists",
      "attributes": {
        "title": "My Playlist",
        "description": "Playlist description",  // ❌ REMOVED
        "tracksCount": 10,
        ...
      }
    }
  ]
}
```

**After:**

```json
{
  "data": [
    {
      "id": "...",
      "type": "playlists",
      "attributes": {
        "title": "My Playlist",
        "tracksCount": 10,
        ...
      }
    }
  ]
}
```

> **Note:** The `description` field is still available when fetching a **single playlist** via `GET /playlists/:playlistId`.

---

### 2. Playlists - New `tracksCount` Field

**Endpoints:**

- `GET /playlists` (list)
- `GET /playlists/:playlistId` (single)

A new `tracksCount` field has been added to playlist responses.

**Response:**

```json
{
  "data": {
    "id": "...",
    "type": "playlists",
    "attributes": {
      "title": "My Playlist",
      "tracksCount": 10,  // ✅ NEW FIELD
      ...
    }
  }
}
```

**TypeScript Update:**

```typescript
interface PlaylistAttributes {
  // ... existing fields
  tracksCount: number // NEW
}
```

---

### 3. Tags - JSON:API Format

**Endpoints:**

- `POST /tags` (create)
- `GET /tags/search` (search)

Tags endpoints now return JSON:API formatted responses.

**Before (Create):**

```json
{
  "id": "uuid",
  "name": "Rock"
}
```

**After (Create):**

```json
{
  "data": {
    "id": "uuid",
    "type": "tags",
    "attributes": {
      "name": "Rock"
    }
  }
}
```

**Before (Search):**

```json
[
  { "id": "uuid1", "name": "Rock" },
  { "id": "uuid2", "name": "Pop" }
]
```

**After (Search):**

```json
{
  "data": [
    {
      "id": "uuid1",
      "type": "tags",
      "attributes": { "name": "Rock" }
    },
    {
      "id": "uuid2",
      "type": "tags",
      "attributes": { "name": "Pop" }
    }
  ]
}
```

**TypeScript Interfaces:**

```typescript
interface TagAttributes {
  name: string
}

interface TagResource {
  id: string
  type: 'tags'
  attributes: TagAttributes
}

interface GetTagOutput {
  data: TagResource
}

interface GetTagsOutput {
  data: TagResource[]
}
```

---

## Request Payload Changes (Breaking)

All create/update endpoints now use **JSON:API format** for request bodies.

### 1. Create Tag

**Endpoint:** `POST /tags`

**Before:**

```json
{
  "name": "Rock"
}
```

**After:**

```json
{
  "data": {
    "type": "tags",
    "attributes": {
      "name": "Rock"
    }
  }
}
```

---

### 2. Create Artist

**Endpoint:** `POST /artists`

**Before:**

```json
{
  "name": "Artist Name"
}
```

**After:**

```json
{
  "data": {
    "type": "artists",
    "attributes": {
      "name": "Artist Name"
    }
  }
}
```

---

### 3. Create Playlist

**Endpoint:** `POST /playlists`

**Before:**

```json
{
  "title": "My Playlist",
  "description": "Description"
}
```

**After:**

```json
{
  "data": {
    "type": "playlists",
    "attributes": {
      "title": "My Playlist",
      "description": "Description"
    }
  }
}
```

---

### 4. Update Playlist

**Endpoint:** `PUT /playlists/:id`

**Before:**

```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**After:**

```json
{
  "data": {
    "type": "playlists",
    "attributes": {
      "title": "Updated Title",
      "description": "Updated description"
    }
  }
}
```

---

### 5. Upload Track

**Endpoint:** `POST /tracks` (multipart/form-data)

**Before:**

```
title: "Track Title"
artists: ["artist-id-1", "artist-id-2"]
tags: ["tag-id-1"]
```

**After:**

```
data[type]: "tracks"
data[attributes][title]: "Track Title"
data[attributes][artists]: ["artist-id-1", "artist-id-2"]
data[attributes][tags]: ["tag-id-1"]
```

---

### 6. Update Track

**Endpoint:** `PATCH /tracks/:id`

**Before:**

```json
{
  "title": "Updated Title",
  "artists": ["artist-id"],
  "tags": ["tag-id"]
}
```

**After:**

```json
{
  "data": {
    "type": "tracks",
    "attributes": {
      "title": "Updated Title",
      "artists": ["artist-id"],
      "tags": ["tag-id"]
    }
  }
}
```

---

### 7. Add Track to Playlist

**Endpoint:** `POST /playlists/:id/tracks`

**Before:**

```json
{
  "trackId": "track-uuid"
}
```

**After:**

```json
{
  "data": {
    "type": "playlist-tracks",
    "attributes": {
      "trackId": "track-uuid"
    }
  }
}
```

---

## Summary of Breaking Changes

| Category        | Change                                              | Impact                                              |
| --------------- | --------------------------------------------------- | --------------------------------------------------- |
| Request Format  | All create/update payloads now use JSON:API wrapper | **HIGH** - All POST/PUT/PATCH requests need updates |
| Response Format | Tags endpoints now return JSON:API format           | **MEDIUM** - Update tag parsing logic               |
| Response Format | Playlist list no longer includes `description`      | **LOW** - Remove usage or fetch single playlist     |
| New Field       | `tracksCount` added to playlist responses           | **LOW** - Can be used for UI display                |
| New Endpoints   | `/playlists/count/:userId`                          | **NONE** - New feature                              |
| New Endpoints   | `/playlists/tracks/count/:userId`                   | **NONE** - New feature                              |

---

## Migration Checklist

- [ ] Update all API request payloads to JSON:API format
- [ ] Update tag response parsing (access via `response.data` / `response.data.attributes`)
- [ ] Remove reliance on `description` field in playlist lists
- [ ] Add `tracksCount` to playlist TypeScript interfaces
- [ ] (Optional) Implement new count endpoints for user statistics

---

## TypeScript Helper Types

```typescript
// Generic JSON:API Request Wrapper
interface JsonApiRequest<T extends string, A> {
  data: {
    type: T
    attributes: A
  }
}

// Example usage:
type CreateTagRequest = JsonApiRequest<'tags', { name: string }>
type CreatePlaylistRequest = JsonApiRequest<
  'playlists',
  {
    title: string
    description: string | null
  }
>
type CreateArtistRequest = JsonApiRequest<'artists', { name: string }>
type UpdateTrackRequest = JsonApiRequest<
  'tracks',
  {
    title?: string
    artists?: string[]
    tags?: string[]
  }
>
```
