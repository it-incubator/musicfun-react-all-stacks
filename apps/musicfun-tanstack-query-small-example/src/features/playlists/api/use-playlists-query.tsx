import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getClient } from '../../../shared/api/client.ts'
import type { SchemaGetPlaylistsRequestPayload } from '../../../shared/api/schema.ts'
import { requestWrapper } from '../../../shared/api/request-wrapper.ts'

export const playlistListKey = (p: Partial<SchemaGetPlaylistsRequestPayload> = {}) => {
  const {
    pageNumber = 1,
    pageSize = 20,
    search = '',
    sortBy = 'publishedAt',
    sortDirection = 'desc',
    tagsIds = [],
    userId = null,
    trackId = null,
  } = p

  return [
    'playlists',
    {
      pageNumber,
      pageSize,
      search,
      sortBy,
      sortDirection,
      tagsIds: [...tagsIds].sort(),
      userId,
      trackId,
    } as SchemaGetPlaylistsRequestPayload,
  ] as const // даёт key-tuple с readonly типами
}

export function usePlaylistsQuery(search: string, pageNumber: number, userId: string | undefined) {
  const query = useQuery({
    queryKey: playlistListKey({
      search,
      pageNumber,
      userId,
    }),
    queryFn: () => {
      return requestWrapper(
        getClient().GET('/playlists', {
          params: {
            query: {
              search: search && undefined,
              pageNumber,
              pageSize: 5,
              userId,
            },
          },
        }),
      )
    },
    placeholderData: keepPreviousData,
  })
  return query
}
