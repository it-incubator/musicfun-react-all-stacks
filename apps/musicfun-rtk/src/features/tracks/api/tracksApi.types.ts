import type { Images, Meta, Nullable, User } from '@/common/types'
import type { Artist } from '@/features/artists/api/artistsApi.types.ts'
import type { Tag } from '@/features/tags/api/tagsApi.types.ts'
import type { CurrentUserReaction } from '../lib/enums/enums.ts'

export type TrackDetails<T> = {
  id: string
  type: 'tracks'
  attributes: T
  relationships: {
    artists: {
      data: {
        id: string
        type: string
      }[]
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
}

export type FetchTracksAttributes = BaseAttributes & {
  user: User
  isPublished: boolean
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
  isPublished: boolean
  // likes
  dislikesCount: number
  likesCount: number
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
  fileSize: number
}

// Response
export type FetchTracksResponse = {
  data: TrackDetails<FetchTracksAttributes>[]
  meta: Meta & {
    nextCursor: string
  }
}

export type TrackApiResponse = {
  data: TrackDetails<TrackDetailAttributes>
}

export type FetchPlaylistsTracksResponse = {
  data: TrackDetails<PlaylistItemAttributes>[]
  meta: Meta['totalCount']
}

// Arguments
// export type FetchTracksArgs = {
//   pageSize?: number
//   pageNumber: number
//   search?: string
//   sortBy?: 'addedAt' | 'likesCount'
//   sortDirection?: 'asc' | 'desc'
//   tagsIds?: string[]
//   artistsIds?: string[]
//   userId?: string
//   includeDrafts?: boolean
//   paginationType?: PaginationType
//   cursor?: string
// }

export type PaginationType = 'offset' | 'cursor'

export type FetchTracksArgs<T extends PaginationType = PaginationType> = {
  pageSize?: number
  search?: string
  sortBy?: 'addedAt' | 'likesCount'
  sortDirection?: 'asc' | 'desc'
  tagsIds?: string[]
  artistsIds?: string[]
  userId?: string
  includeDrafts?: boolean
  paginationType: T
} & (T extends 'cursor' ? { cursor: string; pageNumber?: never } : { pageNumber: number; cursor?: never })

export type UpdateTrackArgs = {
  title: string
  lyrics: string
  releaseDate: Nullable<string>
  tagIds: string[]
  artistsIds: string[]
}

// Literal types
type TrackVisibility = 'private' | 'public'

type TrackProcessingStatus = 'uploaded' | 'converting' | 'ready'
