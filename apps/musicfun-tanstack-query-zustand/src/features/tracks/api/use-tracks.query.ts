import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client'
import type { SchemaGetTracksRequestPayload } from '@/shared/api/schema'
import { VU } from '@/shared/utils'

import { tracksKeys } from './query-key-factory'

export const useTracks = (params: SchemaGetTracksRequestPayload) => {
  return useQuery({
    queryKey: tracksKeys.list(params),

    queryFn: () => {
      return getClient().GET('/playlists/tracks', {
        params: {
          query: {
            ...params,
            search: params.search || undefined,
            tagsIds: VU.isValid(params.tagsIds) ? params.tagsIds : undefined,
            artistsIds: VU.isValid(params.artistsIds) ? params.artistsIds : undefined,
            userId: params.userId || undefined,
            cursor: params.cursor || undefined,
          },
        },
      })
    },

    placeholderData: keepPreviousData,
  })
}



