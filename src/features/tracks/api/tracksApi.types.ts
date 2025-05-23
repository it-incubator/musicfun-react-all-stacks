import type { Meta, Nullable } from "@/common"

export type TrackDetails<T> = {
  id: string
  type: "tracks"
  attributes: T
}

export type TrackListItemAttributes = {
  title: string
  addedAt: string
  attachmentsCount: number
}

export type TrackDetailsAttributes = {
  title: string
  addedAt: string
  lyrics: Nullable<string>
  releaseDate: Nullable<string>
  updatedAt: string
  duration: number
  processingStatus: string // "uploaded"
  visibility: string // "private"
  tags: string[]
  artists: string[]
  attachments: TrackAttachment[]
}

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
  data: TrackDetails<TrackListItemAttributes>[]
  meta: Meta
}

export type CreateTrackResponse = {
  data: TrackDetails<TrackDetailsAttributes>
}
