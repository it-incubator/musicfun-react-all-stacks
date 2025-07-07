import type { Meta } from '@/common/types'
import type { components } from '@/common/api/schema.ts'

export type GetPlaylistsRequestPayload = components['schemas']['GetPlaylistsRequestPayload']
export type GetPlaylistOutputData = components['schemas']['GetPlaylistOutputData']
export type GetPlaylistOutputDataAttributes = components['schemas']['GetPlaylistOutputDataAttributes']

export type Playlist = GetPlaylistOutputData
export type PlaylistAttributes = GetPlaylistOutputDataAttributes

// Response
export type PlaylistsResponse = {
  data: Playlist[]
  meta: Meta
}

// Arguments
export type CreatePlaylistArgs = Pick<PlaylistAttributes, 'title' | 'description'>

export type UpdatePlaylistArgs = Partial<Pick<PlaylistAttributes, 'title' | 'description' | 'tags'>>
