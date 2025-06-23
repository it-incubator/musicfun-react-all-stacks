import type { FetchTracksArgs } from "./tracksApi.types.ts"
import { baseApi } from "@/app/api/base-api.ts"

export const tracksAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.query({
      query: (params: FetchTracksArgs) => ({ url: "playlists/tracks", params }),
      providesTags: ["Track"],
    }),
  }),
})

export const { useFetchTracksQuery } = tracksAPI
