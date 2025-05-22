import type { Meta } from "@/common"

export type Playlist = {
  id: string
  type: "playlists"
  attributes: PlaylistAttributes
}

export type PlaylistAttributes = {
  title: string
  description: string
  addedAt: string
  updatedAt: string
  order: number
  images: {
    main: PlaylistCover[]
  }
  tags: string[]
}

export type PlaylistCover = {
  url: string
  fileSize: number
  width: number
  height: number
}

// Response
export type PlaylistsResponse = {
  data: Playlist[]
  meta: Meta
}

export type UploadPlaylistCoverResponse = {
  main: PlaylistCover[]
}

// Arguments
export type CreatePlaylistArgs = Pick<PlaylistAttributes, "title" | "description">

export type UpdatePlaylistArgs = Partial<Pick<PlaylistAttributes, "title" | "description" | "tags">>
