import { baseApi } from "./baseApi"

export const testApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTracks: build.query<any, any>({
      query: () => ({
        url: `/playlists/tracks`,
      }),
    }),
  }),
})
export const {useGetTracksQuery } = testApi
