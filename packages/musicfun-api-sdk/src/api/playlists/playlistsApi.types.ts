import { Images, User } from '../../common/types/playlists-tracks.types'
import { Meta } from '../../common/types/common.types'

export type Playlist = {
  id: string
  type: 'playlists'
  attributes: PlaylistAttributes
}

export type PlaylistAttributes = {
  title: string
  description: string
  addedAt: string
  updatedAt: string
  order: number
  tags: string[]
  images: Images
  user: User
}

// Response
export type PlaylistsResponse = {
  data: Playlist[]
  meta: Meta
}

// Arguments
export type CreatePlaylistArgs = Pick<PlaylistAttributes, 'title' | 'description'>

export type UpdatePlaylistArgs = Partial<Pick<PlaylistAttributes, 'title' | 'description' | 'tags'>>
