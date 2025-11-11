import type { SchemaGetPlaylistsRequestPayload } from '@/shared/api/schema.ts'

export const playlistsKeys = {
  all: ['playlists'] as const, // playlists
  lists: () => [...playlistsKeys.all, 'list'] as const, //  playlists, list
  list: (filters: SchemaGetPlaylistsRequestPayload) =>
    [...playlistsKeys.lists(), { filters }] as const, //  playlists, list, {:filter}
  details: () => [...playlistsKeys.all, 'detail'] as const, // playlists, detail
  detail: (id: number) => [...playlistsKeys.details(), id] as const, // playlists, details, :id
}
