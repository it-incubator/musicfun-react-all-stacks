import type { Cover, Meta, User } from "@/common/types"

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
    main: Cover[]
  }
  tags: string[]
  user: User
}

// Response
export type PlaylistsResponse = {
  data: Playlist[]
  meta: Meta
}

export type UploadPlaylistCoverResponse = {
  main: Cover[]
}

// Arguments
export type CreatePlaylistArgs = Pick<PlaylistAttributes, "title" | "description">

export type UpdatePlaylistArgs = Partial<Pick<PlaylistAttributes, "title" | "description" | "tags">>
