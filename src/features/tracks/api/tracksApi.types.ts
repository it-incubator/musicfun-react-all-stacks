import type { Meta, Nullable } from "@/common"

export type TrackDetails<T> = {
  id: string
  type: "tracks" // TODO: tracks, playlists. Какие еще типы будут
  attributes: T
}

// Attributes
export type BaseAttributes = {
  title: string
  addedAt: string
  attachments: TrackAttachment[]
}

export type FetchTracksAttributes = BaseAttributes & {
  images: string[]
  user: {
    id: string
    name: string
  }
}

export type TrackDetailAttributes = BaseAttributes & {
  lyrics: Nullable<string>
  releaseDate: Nullable<string>
  updatedAt: string
  duration: number
  processingStatus: "uploaded" // TODO: какие еще будут статусы ?
  visibility: "private" // TODO: какие еще будут типы ?
  tags: string[]
  artists: string[]
}

export type PlaylistItemAttributes = BaseAttributes & {
  updatedAt: string
  order: number
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
  data: TrackDetails<FetchTracksAttributes>[]
  meta: Meta
}

export type CreateTrackResponse = {
  data: TrackDetails<TrackDetailAttributes>
}

export type FetchPlaylistsTracksResponse = {
  data: TrackDetails<PlaylistItemAttributes>[]
  meta: Meta
}

// TODO: Часть свойств можно взять из TrackDetailAttributes, но не все. Пока хз, как лучше описывать типы
export type UpdateTrackResponse = {
  id: string
  addedAt: string
  deletedAt: null
  duration: number
  lyrics: string
  processingStatus: "uploaded"
  releaseDate: null
  title: string
  trackTags: []
  updatedAt: string
  userId: string
  version: number
  visibility: "private"
}

// Arguments
// TODO: Часть свойств можно взять из TrackDetailAttributes, и добавить tagIds, artistsIds
// Не факт что станет читаемее
export type UpdateTrackArgs = {
  title?: string
  lyrics?: string
  processingStatus?: "uploaded"
  visibility?: "private"
  duration?: number
  releaseDate?: string
  tagIds?: string[]
  artistsIds?: string[]
}
