import { baseApi } from '@/app/api/baseApi.ts'
import { withZodCatch } from '@/common/utils'
import type { FetchTracksResponse } from '@/features/tracks/api/tracksApi.types.ts'
import { fetchTracksResponseSchema } from '@/features/tracks/model/tracks.schemas.ts'

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          return lastPage.meta.nextCursor || null
        },
      },
      query: ({ pageParam }) => ({
        url: 'playlists/tracks',
        params: { cursor: pageParam, paginationType: 'cursor', pageSize: 5 },
      }),
      ...withZodCatch(fetchTracksResponseSchema),
    }),
  }),
})
export const { useFetchTracksInfiniteQuery } = tracksApi
