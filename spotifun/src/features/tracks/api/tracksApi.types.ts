import type { Images, Meta, Nullable, User } from "@/common/types"
import type { Artist } from "@/features/artists/api/artistsApi.types.ts"
import type { Tag } from "@/features/tags/api/tagsApi.types.ts"

export type TrackDetails<T> = {
  id: string
  type: "tracks"
  attributes: T
}

// Attributes
export type BaseAttributes = {
  title: string
  addedAt: string
  attachments: TrackAttachment[]
  images: Images
}

export type FetchTracksAttributes = BaseAttributes & {
  user: User
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
  currentUserReaction: number // [-1, 1, 0]
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
  originalKey: string
  fileSize: number
}

// Response
export type FetchTracksResponse = {
  data: TrackDetails<FetchTracksAttributes>[]
  meta: Meta
}

export type FetchPlaylistsTracksResponse = {
  data: TrackDetails<PlaylistItemAttributes>[]
  meta: Meta
}

// Arguments
export type UpdateTrackArgs = {
  title?: string
  lyrics?: string
  visibility?: TrackVisibility
  releaseDate?: string
  tagIds?: string[]
  artistsIds?: string[]
}

// Literal types
type TrackVisibility = "private" | "public"

type TrackProcessingStatus = "uploaded" | "converting" | "ready"
