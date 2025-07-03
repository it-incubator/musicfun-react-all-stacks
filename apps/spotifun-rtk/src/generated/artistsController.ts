import { baseApi as api } from "../app/api/base-api"
export const addTagTypes = ["Artists"] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      artistsControllerCreateArtist: build.mutation<
        ArtistsControllerCreateArtistResponse,
        ArtistsControllerCreateArtistArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/artists`, method: "POST", body: queryArg.artistCreateInputDto }),
        invalidatesTags: ["Artists"],
      }),
      artistsControllerSearchArtist: build.query<
        ArtistsControllerSearchArtistResponse,
        ArtistsControllerSearchArtistArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/artists/search`,
          params: {
            term: queryArg.term,
          },
        }),
        providesTags: ["Artists"],
      }),
      artistsControllerDeleteTag: build.mutation<ArtistsControllerDeleteTagResponse, ArtistsControllerDeleteTagArgs>({
        query: (queryArg) => ({ url: `/api/1.0/artists/${queryArg.id}`, method: "DELETE" }),
        invalidatesTags: ["Artists"],
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as generatedApi }
export type ArtistsControllerCreateArtistResponse = /** status 201 Created: Исполнитель успешно создан */ ArtistDto
export type ArtistsControllerCreateArtistArgs = {
  artistCreateInputDto: ArtistCreateInputDto
}
export type ArtistsControllerSearchArtistResponse =
  /** status 200 OK: Список исполнителей найден по подстроке */ ArtistDto[]
export type ArtistsControllerSearchArtistArgs = {
  term: string
}
export type ArtistsControllerDeleteTagResponse = unknown
export type ArtistsControllerDeleteTagArgs = {
  id: string
}
export type ArtistDto = {
  id: string
  name: string
}
export type ArtistCreateInputDto = {
  name: string
}
export const {
  useArtistsControllerCreateArtistMutation,
  useArtistsControllerSearchArtistQuery,
  useArtistsControllerDeleteTagMutation,
} = injectedRtkApi
