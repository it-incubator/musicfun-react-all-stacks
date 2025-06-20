import { url } from "inspector"
import { baseApi } from "./baseApi"

export const testApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTracks: build.query<any, any>({
      query: () => ({
        url: `/playlists/tracks`,
      }),
    }),
    like: build.mutation<any, any>({
      query: () => ({
        url: "playlists/tracks/19651467-bb86-4728-a9ae-40522b26ead2/like",
        method: "POST",
      }),
    }),
  }),
})
export const { useGetTracksQuery, useLikeMutation } = testApi
