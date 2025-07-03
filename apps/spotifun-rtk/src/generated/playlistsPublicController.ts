import { baseApi as api } from "../app/api/base-api"
export const addTagTypes = ["Playlists Public"] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      playlistsPublicControllerGetPlaylists: build.query<
        PlaylistsPublicControllerGetPlaylistsResponse,
        PlaylistsPublicControllerGetPlaylistsArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists`,
          params: {
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            search: queryArg.search,
            sortBy: queryArg.sortBy,
            sortDirection: queryArg.sortDirection,
            tagsIds: queryArg.tagsIds,
            userId: queryArg.userId,
            trackId: queryArg.trackId,
          },
        }),
        providesTags: ["Playlists Public"],
      }),
      playlistsPublicControllerGetPlaylistById: build.query<
        PlaylistsPublicControllerGetPlaylistByIdResponse,
        PlaylistsPublicControllerGetPlaylistByIdArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/${queryArg.id}` }),
        providesTags: ["Playlists Public"],
      }),
      playlistsPublicControllerLikePlaylist: build.mutation<
        PlaylistsPublicControllerLikePlaylistResponse,
        PlaylistsPublicControllerLikePlaylistArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/${queryArg.id}/like`, method: "POST" }),
        invalidatesTags: ["Playlists Public"],
      }),
      playlistsPublicControllerDislikePlaylist: build.mutation<
        PlaylistsPublicControllerDislikePlaylistResponse,
        PlaylistsPublicControllerDislikePlaylistArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/${queryArg.id}/dislike`, method: "POST" }),
        invalidatesTags: ["Playlists Public"],
      }),
      playlistsPublicControllerRemovePlaylistReaction: build.mutation<
        PlaylistsPublicControllerRemovePlaylistReactionResponse,
        PlaylistsPublicControllerRemovePlaylistReactionArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/${queryArg.id}/reaction`, method: "DELETE" }),
        invalidatesTags: ["Playlists Public"],
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as generatedApi }
export type PlaylistsPublicControllerGetPlaylistsResponse =
  /** status 200 OK: JSON:API список плейлистов с пагинацией */ PlaylistListJsonApiResponse
export type PlaylistsPublicControllerGetPlaylistsArgs = {
  /** Номер страницы для пагинации */
  pageNumber?: number
  /** Размер страницы для пагинации */
  pageSize?: number
  /** Строка для поиска по названию плейлиста */
  search?: string
  sortBy?: "addedAt" | "likesCount"
  sortDirection?: "asc" | "desc"
  tagsIds?: string[]
  userId?: string
  trackId?: string
}
export type PlaylistsPublicControllerGetPlaylistByIdResponse =
  /** status 200 OK: Плейлист успешно найден */ PlaylistSingleResponse
export type PlaylistsPublicControllerGetPlaylistByIdArgs = {
  /** ID плейлиста */
  id: string
}
export type PlaylistsPublicControllerLikePlaylistResponse = /** status 201 OK */ ReactionResponseDto
export type PlaylistsPublicControllerLikePlaylistArgs = {
  id: string
}
export type PlaylistsPublicControllerDislikePlaylistResponse = /** status 201 OK */ ReactionResponseDto
export type PlaylistsPublicControllerDislikePlaylistArgs = {
  id: string
}
export type PlaylistsPublicControllerRemovePlaylistReactionResponse = /** status 200  */ ReactionResponseDto
export type PlaylistsPublicControllerRemovePlaylistReactionArgs = {
  id: string
}
export type UserOutputDto = {
  id: string
  name: string
}
export type ImageDto = {
  type: "original" | "thumbnail" | "medium"
  width: number
  height: number
  fileSize: number
  url: string
}
export type PlaylistImagesOutputDto = {
  /** Оригинальное изображение и превьюшки */
  main?: ImageDto[]
}
export type PlaylistAttributesDto = {
  title: string
  description: object
  addedAt: string
  updatedAt: string
  order: number
  user: UserOutputDto
  images: PlaylistImagesOutputDto
  tags: string[]
  likesCount: number
  dislikesCount: number
  /** 0 (не залогинен или не реагировал), 1 — лайк, -1 — дизлайк */
  currentUserReaction: 0 | 1 | -1
}
export type PlaylistListItemJsonApiData = {
  id: string
  type: string
  attributes: PlaylistAttributesDto
}
export type JsonApiMetaWithPaging = {
  totalCount: number
  page: number
  pageSize: number
  pagesCount: number
}
export type PlaylistListJsonApiResponse = {
  data: PlaylistListItemJsonApiData[]
  meta: JsonApiMetaWithPaging
}
export type PlaylistSingleData = {
  id: string
  type: string
  attributes: PlaylistAttributesDto
}
export type PlaylistSingleResponse = {
  data: PlaylistSingleData
}
export type ReactionResponseDto = {
  objectId: string
  value: 0 | 1 | -1
  likes: number
  dislikes: number
}
export const {
  usePlaylistsPublicControllerGetPlaylistsQuery,
  usePlaylistsPublicControllerGetPlaylistByIdQuery,
  usePlaylistsPublicControllerLikePlaylistMutation,
  usePlaylistsPublicControllerDislikePlaylistMutation,
  usePlaylistsPublicControllerRemovePlaylistReactionMutation,
} = injectedRtkApi
