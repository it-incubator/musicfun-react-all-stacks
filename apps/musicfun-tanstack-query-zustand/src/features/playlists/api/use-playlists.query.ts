import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { playlistsKeys } from '@/features/playlists/api/query-key-factory.ts'
import { getClient } from '@/shared/api/client.ts'
import type { SchemaGetPlaylistsRequestPayload } from '@/shared/api/schema.ts'
import { VU } from '@/shared/utils'

export const usePlaylists = (params: SchemaGetPlaylistsRequestPayload, opts?: { enabled?: boolean }) => {
  const query = useQuery({
    queryKey: playlistsKeys.list(params),
    queryFn: () => {
      return getClient().GET('/playlists', {
        params: {
          query: {
            ...params,
            search: params.search || undefined,
            tagsIds: VU.isValid(params.tagsIds) ? params.tagsIds : undefined,
          },
        },
      })
    },
    enabled: opts?.enabled ?? true, 
    placeholderData: keepPreviousData,
  })

  return query
}
