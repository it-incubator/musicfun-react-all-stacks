import { baseApi } from "@/app/api/baseApi.ts"
import { tracksApi } from "@it-incubator/spotifun-api-sdk"

export const tracksAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.query({ queryFn: tracksApi.fetchTracks }),
  }),
})

export const { useFetchTracksQuery } = tracksAPI
