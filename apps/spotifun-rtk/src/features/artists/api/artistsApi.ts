import { baseApi } from "@/app/api/baseApi.ts"
import { artistsEndpoint } from "@/common/apiEntities"
import type { Artist } from "./artistsApi.types.ts"

export const artistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    findArtists: build.query<Artist[], string>({
      query: (name) => ({ url: `${artistsEndpoint}/search?term=${name}` }),
      providesTags: ["Artist"],
    }),
  }),
})

export const { useFindArtistsQuery } = artistsApi

// export const artistsApi = {
//   findArtists: (name: string) => {
//     return getInstance().get<Artist[]>(`${artistsEndpoint}/search?term=${name}`)
//   },
//   createArtist: (name: string) => {
//     return getInstance().post<Artist>(artistsEndpoint, { name })
//   },
//   removeArtist: (id: string) => {
//     return getInstance().delete<void>(`${artistsEndpoint}/${id}`)
//   },
// }
