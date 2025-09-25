import type { CurrentUserReaction } from '@/common/enums'
import type { Images, User } from '@/common/types'

export type FetchTracksResponse = {
  data: TrackData[]
  included: TracksIncluded[]
  meta: TracksMeta
}

export type TrackData = {
  id: string
  type: 'tracks'
  attributes: TrackAttributes
  relationships: TrackRelationships
}

export type TracksIncluded = {
  id: string
  type: 'artists'
  attributes: {
    name: string
  }
}

export type TracksMeta = {
  nextCursor: string | null
  page: number
  pageSize: number
  totalCount: number | null
  pagesCount: number | null
}

export type TrackAttributes = {
  title: string
  addedAt: string
  attachments: TrackAttachment[]
  images: Images
  currentUserReaction: CurrentUserReaction
  user: User
  isPublished: boolean
  publishedAt: string
}

export type TrackRelationships = {
  artists: {
    data: {
      id: string
      type: string
    }
  }
}

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

// Arguments
export type FetchTracksArgs = {
  pageNumber?: number
  pageSize?: number
  search?: string
  sortBy?: 'publishedAt' | 'likesCount'
  sortDirection?: 'asc' | 'desc'
  tagsIds?: string[]
  artistsIds?: string[]
  userId?: string
  includeDrafts?: boolean
  paginationType?: 'offset' | 'cursor'
  cursor?: string
}
