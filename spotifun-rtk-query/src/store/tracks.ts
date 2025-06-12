import { createApi } from "@reduxjs/toolkit/query/react"
import { tracksApi } from "./tracksApi.ts"

export const tracksAPI = createApi({
  reducerPath: 'tracks',
  baseQuery: () => ({ data: undefined }),
  endpoints: (build) => ({
    fetchTracks: build.query({
      queryFn: tracksApi.fetchTracks
    }),
  }),
})

export const { useFetchTracksQuery } = tracksAPI