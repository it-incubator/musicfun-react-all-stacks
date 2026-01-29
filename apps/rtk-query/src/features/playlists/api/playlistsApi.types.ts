import type { Images, Meta, User } from '@/shared/types/commonApi.types.ts'

export enum CurrentUserReaction {
  None = 0,
  Like = 1,
  Dislike = -1,
}

export type Playlist = {
  id: string
  type: 'playlists'
  attributes: PlaylistAttributes
}

export type PlaylistDetail = {
  id: string
  type: 'playlists'
  attributes: PlaylistDetailAttributes
}

type Tag = {
  id: string
  name: string
}

// Base attributes present in both list and single playlist responses
type BasePlaylistAttributes = {
  title: string
  addedAt: string
  updatedAt: string
  order: number
  tags: Tag[]
  images: Images
  user: User
  tracksCount: number
  // likes
  currentUserReaction: CurrentUserReaction
  dislikesCount: number
  likesCount: number
}

// Attributes for playlist list (description removed from list response)
export type PlaylistListAttributes = BasePlaylistAttributes

// Attributes for single playlist (includes description)
export type PlaylistDetailAttributes = BasePlaylistAttributes & {
  description: string
}

// For backward compatibility - used in list responses
export type PlaylistAttributes = PlaylistListAttributes

// Response
export type PlaylistsResponse = {
  data: Playlist[]
  meta: Meta
}

// Arguments
export type CreatePlaylistArgs = {
  title: string
  description: string
}

export type UpdatePlaylistArgs = {
  title?: string
  description?: string
  tagIds: string[]
}

export type FetchPlaylistsArgs = {
  pageSize?: number
  pageNumber?: number
  search?: string
  sortBy?: 'addedAt' | 'likesCount'
  sortDirection?: 'asc' | 'desc'
  tagsIds?: string[] // e.g.: tagsIds=tag1&tagsIds=tag2
  userId?: string
  trackId?: string
}
