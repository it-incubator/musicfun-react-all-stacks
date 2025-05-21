export type PlaylistsResponse = {
  data: PlaylistItem[]
  meta: Meta
}

export type PlaylistItem = {
  id: string
  type: "playlists"
  attributes: Attributes
}

export type Attributes = {
  title: string
  description: string
  addedAt: string
  updatedAt: string
  order: number
  images: {
    main: string[]
  }
  tags: string[]
}

export type Meta = {
  page: number
  pageSize: number
  totalCount: number
  pagesCount: number
}

export type CreatePlaylistArgs = Pick<Attributes, "title" | "description">

export type UpdatePlaylistArgs = Partial<Pick<Attributes, "title" | "description" | "tags">>
