import { baseApi as api } from "../app/api/base-api"
export const addTagTypes = ["Playlists Owner"] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      playlistsControllerGetMyPlaylists: build.query<
        PlaylistsControllerGetMyPlaylistsResponse,
        PlaylistsControllerGetMyPlaylistsArgs
      >({
        query: () => ({ url: `/api/1.0/playlists/my` }),
        providesTags: ["Playlists Owner"],
      }),
      playlistsControllerCreatePlaylist: build.mutation<
        PlaylistsControllerCreatePlaylistResponse,
        PlaylistsControllerCreatePlaylistArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists`, method: "POST", body: queryArg.playlistCreateInputDto }),
        invalidatesTags: ["Playlists Owner"],
      }),
      playlistsControllerUpdatePlaylist: build.mutation<
        PlaylistsControllerUpdatePlaylistResponse,
        PlaylistsControllerUpdatePlaylistArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists/${queryArg.playlistId}`,
          method: "PUT",
          body: queryArg.playlistUpdateInputDto,
        }),
        invalidatesTags: ["Playlists Owner"],
      }),
      playlistsControllerDeletePlaylist: build.mutation<
        PlaylistsControllerDeletePlaylistResponse,
        PlaylistsControllerDeletePlaylistArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/${queryArg.playlistId}`, method: "DELETE" }),
        invalidatesTags: ["Playlists Owner"],
      }),
      playlistsControllerReorderPlaylist: build.mutation<
        PlaylistsControllerReorderPlaylistResponse,
        PlaylistsControllerReorderPlaylistArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists/${queryArg.playlistId}/reorder`,
          method: "PUT",
          body: queryArg.reorderPlaylistInputDto,
        }),
        invalidatesTags: ["Playlists Owner"],
      }),
      playlistsControllerUploadMainImage: build.mutation<
        PlaylistsControllerUploadMainImageResponse,
        PlaylistsControllerUploadMainImageArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists/${queryArg.playlistId}/images/main`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Playlists Owner"],
      }),
      playlistsControllerDeleteTrackCover: build.mutation<
        PlaylistsControllerDeleteTrackCoverResponse,
        PlaylistsControllerDeleteTrackCoverArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/${queryArg.playlistId}/images/main`, method: "DELETE" }),
        invalidatesTags: ["Playlists Owner"],
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as generatedApi }
export type PlaylistsControllerGetMyPlaylistsResponse =
  /** status 200 OK: Список плейлистов успешно получен */ MyPlaylistListJsonApiResponse
export type PlaylistsControllerGetMyPlaylistsArgs = void
export type PlaylistsControllerCreatePlaylistResponse =
  /** status 201 Created: Плейлист успешно создан */ PlaylistSingleResponse
export type PlaylistsControllerCreatePlaylistArgs = {
  playlistCreateInputDto: PlaylistCreateInputDto
}
export type PlaylistsControllerUpdatePlaylistResponse = unknown
export type PlaylistsControllerUpdatePlaylistArgs = {
  playlistId: string
  playlistUpdateInputDto: PlaylistUpdateInputDto
}
export type PlaylistsControllerDeletePlaylistResponse = unknown
export type PlaylistsControllerDeletePlaylistArgs = {
  playlistId: string
}
export type PlaylistsControllerReorderPlaylistResponse = unknown
export type PlaylistsControllerReorderPlaylistArgs = {
  playlistId: string
  reorderPlaylistInputDto: ReorderPlaylistInputDto
}
export type PlaylistsControllerUploadMainImageResponse = /** status 200 OK: Обложка успешно загружена */ ImagesOutputDto
export type PlaylistsControllerUploadMainImageArgs = {
  playlistId: string
  body: {
    /** Максимальный размер 1 MB, Минимальная высота — 500px, квадратное изображение */
    file: Blob
  }
}
export type PlaylistsControllerDeleteTrackCoverResponse = unknown
export type PlaylistsControllerDeleteTrackCoverArgs = {
  playlistId: string
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
export type MyPlaylistListJsonApiResponse = {
  data: PlaylistListItemJsonApiData[]
}
export type PlaylistSingleData = {
  id: string
  type: string
  attributes: PlaylistAttributesDto
}
export type PlaylistSingleResponse = {
  data: PlaylistSingleData
}
export type PlaylistCreateInputDto = {
  title: string
  description?: string
}
export type PlaylistUpdateInputDto = {
  title: string
  description?: string | null
  tagIds?: string[]
}
export type ReorderPlaylistInputDto = {
  /** ID плейлиста, после которого нужно вставить текущий. null - разместить плейлист в начало списка. */
  putAfterItemId?: string | null
}
export type ImagesOutputDto = {
  /** Должен содержать оригинальный размер изображения и миниатюры, например: original, 320x180 и т.п. */
  main?: ImageDto[]
}
export const {
  usePlaylistsControllerGetMyPlaylistsQuery,
  usePlaylistsControllerCreatePlaylistMutation,
  usePlaylistsControllerUpdatePlaylistMutation,
  usePlaylistsControllerDeletePlaylistMutation,
  usePlaylistsControllerReorderPlaylistMutation,
  usePlaylistsControllerUploadMainImageMutation,
  usePlaylistsControllerDeleteTrackCoverMutation,
} = injectedRtkApi
