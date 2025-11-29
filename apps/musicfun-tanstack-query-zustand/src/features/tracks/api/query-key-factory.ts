import type { SchemaGetTracksRequestPayload } from '@/shared/api/schema'

export const tracksKeys = {
  all: ['tracks'] as const, // tracks
  lists: () => [...tracksKeys.all, 'list'] as const, // tracks, list
  list: (filters: Partial<SchemaGetTracksRequestPayload> | undefined) =>
    [...tracksKeys.lists(), filters] as const, // ['tracks', 'list', {pageNumber: 1, pageSize: 20}]
  infinite: (filters: Partial<SchemaGetTracksRequestPayload> | undefined) =>
    [...tracksKeys.lists(), 'infinite', filters] as const, // ['tracks', 'list', 'infinite', {search: 'rock'}]
  details: () => [...tracksKeys.all, 'detail'] as const, // ['tracks', 'detail']
  detail: (trackId: string) =>
    [...tracksKeys.details(), trackId] as const, // ['tracks','detail','abc123']
  playlist: (playlistId: string) =>
    [...tracksKeys.all, 'playlist', playlistId] as const, // ['tracks','playlist','abc123']
}
