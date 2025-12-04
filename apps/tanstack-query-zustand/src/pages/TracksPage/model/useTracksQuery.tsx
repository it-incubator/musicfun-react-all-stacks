import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { tracksKeys } from '@/features/tracks/api/query-key-factory'
import { getClient } from '@/shared/api/client.ts'
import type { SchemaGetTracksRequestPayload } from '@/shared/api/schema.ts'
import { unwrap } from '@/shared/api/utils/unwrap.ts'
import type { Strict } from '@/shared/types/strict.tsx'

type TracksParams = Partial<SchemaGetTracksRequestPayload>

export function useTracksQuery<P extends TracksParams>(params: Strict<TracksParams, P>) {
  return useQuery({
    queryFn: () =>
      unwrap(
        getClient().GET('/playlists/tracks', {
          params: {
            query: params,
          },
        })
      ),
    queryKey: tracksKeys.list(params),
    placeholderData: keepPreviousData,
  })
}
