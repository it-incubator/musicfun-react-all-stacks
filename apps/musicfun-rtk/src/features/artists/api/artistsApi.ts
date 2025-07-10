import { baseApi } from '@/app/api/base-api.ts'
import type { Artist } from '@/features/artists/api/artistsApi.types.ts'
import { artistsEndpoint } from '@/common/apiEntities'

export const artistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    findArtists: build.query<Artist[], string>({
      query: (name) => `/${artistsEndpoint}/search?search=${name}`,
      providesTags: ['Artist'],
    }),
    createArtist: build.mutation<Artist, string>({
      query: (name) => ({
        url: `/${artistsEndpoint}`,
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Artist'],
    }),
    deleteArtist: build.mutation<void, string>({
      query: (id) => ({
        url: `/${artistsEndpoint}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Artist'],
    }),
  }),
})

export const { useFindArtistsQuery, useCreateArtistMutation, useDeleteArtistMutation } = artistsApi
