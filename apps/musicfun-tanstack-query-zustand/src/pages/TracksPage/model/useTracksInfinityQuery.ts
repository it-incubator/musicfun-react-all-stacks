import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'
import {
  PathsPlaylistsTracksGetParametersQueryPaginationType,
  type SchemaGetTracksRequestPayload,
} from '@/shared/api/schema.ts'
import { unwrap } from '@/shared/api/utils/unwrap.ts'
import type { Strict } from '@/shared/types/strict.tsx'

type TracksParams = Partial<SchemaGetTracksRequestPayload>

export function useTracksInfinityQuery<P extends TracksParams>(params: Strict<TracksParams, P>) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      unwrap(
        getClient().GET('/playlists/tracks', {
          params: {
            query: {
              ...params,
              paginationType: PathsPlaylistsTracksGetParametersQueryPaginationType.cursor,
              cursor: pageParam,
            },
          },
        })
      ),
    queryKey: ['tracks', 'list', params],
    initialPageParam: '0',
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
    placeholderData: keepPreviousData,
  })
}
