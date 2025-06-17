import { baseApi } from "@/app/api/baseApi.ts"
import { type FetchTracksArgs } from "@it-incubator/spotifun-api-sdk"

export const tracksAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.query({
      query: (params: FetchTracksArgs) => ({
        url: 'playlists/tracks',
        params: params
      })
    }),
  }),
})

export const { useFetchTracksQuery } = tracksAPI
