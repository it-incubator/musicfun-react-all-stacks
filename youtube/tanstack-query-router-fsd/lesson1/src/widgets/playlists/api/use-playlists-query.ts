import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { client } from '../../../shared/api/client.ts'
import { playlistsKeys } from '../../../shared/api/keys-factories/playlists-keys-factory.ts'
import type { SchemaGetPlaylistsRequestPayload } from '../../../shared/api/schema.ts'

export const usePlaylistsQuery = (userId: string | undefined, filters: Partial<SchemaGetPlaylistsRequestPayload>) => {
  const key = userId ? playlistsKeys.myList() : playlistsKeys.list(filters)
  const queryParams = userId
    ? {
        userId,
      }
    : filters

  const query = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: key,
    queryFn: async ({ signal }) => {
      const response = await client.GET('/playlists', {
        params: {
          query: queryParams,
        },
        signal,
      })
      if (response.error) {
        throw (response as unknown as { error: Error }).error
      }
      return response.data
    },
    placeholderData: keepPreviousData,
  })
  return query
}
