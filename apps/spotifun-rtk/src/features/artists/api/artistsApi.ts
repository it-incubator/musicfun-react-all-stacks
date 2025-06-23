import { artistsEndpoint } from "@/common/apiEntities"
import type { Artist } from "./artistsApi.types.ts"

import { baseApi } from "@/app/api/base-api.ts"

export const artistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    findArtists: build.query<Artist[], string>({
      query: (name) => ({ url: `${artistsEndpoint}/search?term=${name}` }),
      providesTags: ["Artist"],
    }),
  }),
})

export const { useFindArtistsQuery } = artistsApi

