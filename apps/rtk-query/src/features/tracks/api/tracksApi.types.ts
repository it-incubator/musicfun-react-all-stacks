import type { Tag } from '@/features/tags/api/tagsApi.types.ts'
import {
  CurrentUserReaction,
  type Images,
  type Meta,
  type Nullable,
  type User,
} from '@/shared/types'

export type TrackDetails<T> = {
  id: string
  type: 'tracks'
  attributes: T
  relationships: {
    artists: {
      data: Array<{
        id: string
        type: 'artists'
      }>
    }
  }
}

// Attributes
export type BaseAttributes = {
  title: string
  addedAt: string
  attachments: TrackAttachment[]
  images: Images
  currentUserReaction: CurrentUserReaction
  dislikesCount: number
  likesCount: number
  isPublished: boolean
}

export type FetchTracksAttributes = BaseAttributes & {
  user: User
}

type Artist = {
  id: string
  name: string
}

export type TrackDetailAttributes = BaseAttributes & {
  lyrics: Nullable<string>
  releaseDate: Nullable<string>
  updatedAt: string
  duration: number
  processingStatus: TrackProcessingStatus
  visibility: TrackVisibility
  tags: Tag[]
  artists: Artist[]
  // likes
  dislikesCount: number
  likesCount: number
  user: User
}

export type PlaylistItemAttributes = BaseAttributes & {
  updatedAt: string
  order: number
}

// Attachment
export type TrackAttachment = {
  id: string
  addedAt: string
  updatedAt: string
  version: number
  url: string
  contentType: string
  originalName: string
  originalKey: string
  fileSize: number
}

// Included
export type IncludedArtist = {
  id: string
  type: string
  attributes: { name: string }
}

// Response
export type FetchTracksResponse = {
  data: TrackDetails<FetchTracksAttributes>[]
  meta: Meta
  included: IncludedArtist[]
}

export type FetchTrackByIdResponse = {
  data: TrackDetails<TrackDetailAttributes>
}

export type FetchPlaylistsTracksResponse = {
  data: TrackDetails<PlaylistItemAttributes>[]
  meta: Meta
}

export type ApiTrack = TrackDetails<FetchTracksAttributes>

// Arguments
export type FetchTracksArgs = {
  pageSize?: number
  pageNumber?: number
  search?: string
  sortBy?: 'addedAt' | 'likesCount'
  sortDirection?: 'asc' | 'desc'
  tagsIds?: string[]
  artistsIds?: string[]
  userId?: string
  includeDrafts?: boolean
}

export type UpdateTrackArgs = {
  title?: string
  lyrics?: string
  visibility?: TrackVisibility
  releaseDate?: string
  tagIds?: string[]
  artistsIds?: string[]
}

// Literal types
type TrackVisibility = 'private' | 'public'

type TrackProcessingStatus = 'uploaded' | 'converting' | 'ready'
