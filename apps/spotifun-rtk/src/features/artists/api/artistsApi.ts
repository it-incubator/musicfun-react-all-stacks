import { baseApi } from "@/app/api/base-api.ts"
import type { Artist } from "@/features/artists/api/artistsApi.types.ts"

export const artistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    findArtists: build.query<Artist[], string>({
      query: (name) => ({
        url: `/artists/search?term=${name}`,
        method: "GET",
      }),
      providesTags: ["Artist"],
    }),
    createArtist: build.mutation<Artist[], string>({
      query: (name) => ({
        url: "/artists",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Artist"],
    }),
    deleteArtist: build.mutation<void, string>({
      query: (id) => ({
        url: `/artists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Artist"],
    }),
  }),
})

export const { useFindArtistsQuery, useCreateArtistMutation, useDeleteArtistMutation } = artistsApi
