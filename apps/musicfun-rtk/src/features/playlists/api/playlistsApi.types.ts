import type { Images, Meta, SortBy, SortDirection, User } from '@/common/types'
import type { CurrentUserReaction } from '@/common/enums'
import type { Tag } from '@/features/tags/api/tagsApi.types.ts'

export type Playlist = {
  id: string
  type: 'playlists'
  attributes: PlaylistAttributes
}

export type PlaylistAttributes = {
  title: string
  description: string
  addedAt: string
  updatedAt: string
  order: number
  tags: Tag[]
  images: Images
  user: User
  // likes
  currentUserReaction: CurrentUserReaction
  dislikesCount: number
  likesCount: number
}

// Response
export type PlaylistsResponse = {
  data: Playlist[]
  meta: Meta
}

// Arguments
export type CreatePlaylistArgs = Pick<PlaylistAttributes, 'title' | 'description'>

export type UpdatePlaylistArgs = {
  title?: string
  description?: string
  tagIds?: string[]
}

export type FetchPlaylistsArgs = {
  sortBy?: SortBy
  sortDirection?: SortDirection
  tagsIds?: string[]
  pageSize?: number
  pageNumber: number
  search: string
}

// WebSocket Events
export type PlaylistCreatedEventPayload = {
  data: Playlist
}

export type PlaylistCreatedEvent = {
  type: 'tracks.playlist-created'
  payload: PlaylistCreatedEventPayload
}
