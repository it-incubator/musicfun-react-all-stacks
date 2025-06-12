import { createApi } from "@reduxjs/toolkit/query/react"
import { tracksApi } from "./tracksApi.ts"
import type { FetchTracksResponse } from "./tracksApi.types.ts"

export const tracksAPI = createApi({
  reducerPath: 'tracks',
  baseQuery: () => ({ data: undefined }),
  endpoints: (build) => ({
    getPokemonByName: build.query<FetchTracksResponse, void>({
      queryFn: () => {
        return tracksApi.fetchTracks({
          pageSize: 3,
          pageNumber: 1,
          search: ''
        })
      },
    }),
  }),
})

export const { useGetPokemonByNameQuery } = tracksAPI