import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { playlistsKeys } from '@/features/playlists/api/query-key-factory.ts'
import { getClient } from '@/shared/api/client.ts'
import type { SchemaGetPlaylistsRequestPayload } from '@/shared/api/schema.ts'

export const usePlaylists = ({
  search,
  pageNumber,
  pageSize = 5,
  userId,
  sortBy,
  sortDirection,
  tagsIds,
  trackId,
}: SchemaGetPlaylistsRequestPayload) => {
  const query = useQuery({
    queryKey: playlistsKeys.list({
      search,
      pageNumber,
      pageSize,
      userId,
      sortBy,
      sortDirection,
      tagsIds,
      trackId,
    }),
    queryFn: () => {
      return getClient().GET('/playlists', {
        params: {
          query: {
            search: search || void 0,
            pageNumber,
            pageSize,
            userId,
            sortBy,
            sortDirection,
            tagsIds: tagsIds && tagsIds.length > 0 ? tagsIds : void 0,
            trackId,
          },
        },
      })
    },
    placeholderData: keepPreviousData,
  })

  return query
}
