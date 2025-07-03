import { baseApi as api } from "../app/api/base-api"
export const addTagTypes = ["Tracks Public"] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      tracksPublicControllerGetAllTracks: build.query<
        TracksPublicControllerGetAllTracksResponse,
        TracksPublicControllerGetAllTracksArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists/tracks`,
          params: {
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            search: queryArg.search,
            sortBy: queryArg.sortBy,
            sortDirection: queryArg.sortDirection,
            tagsIds: queryArg.tagsIds,
            artistsIds: queryArg.artistsIds,
            userId: queryArg.userId,
          },
        }),
        providesTags: ["Tracks Public"],
      }),
      tracksPublicControllerGetPlaylistTracks: build.query<
        TracksPublicControllerGetPlaylistTracksResponse,
        TracksPublicControllerGetPlaylistTracksArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/${queryArg.playlistId}/tracks` }),
        providesTags: ["Tracks Public"],
      }),
      tracksPublicControllerGetTrackDetails: build.query<
        TracksPublicControllerGetTrackDetailsResponse,
        TracksPublicControllerGetTrackDetailsArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/tracks/${queryArg.trackId}` }),
        providesTags: ["Tracks Public"],
      }),
      tracksPublicControllerLikeTrack: build.mutation<
        TracksPublicControllerLikeTrackResponse,
        TracksPublicControllerLikeTrackArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/tracks/${queryArg.id}/like`, method: "POST" }),
        invalidatesTags: ["Tracks Public"],
      }),
      tracksPublicControllerDislikeTrack: build.mutation<
        TracksPublicControllerDislikeTrackResponse,
        TracksPublicControllerDislikeTrackArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/tracks/${queryArg.id}/dislike`, method: "POST" }),
        invalidatesTags: ["Tracks Public"],
      }),
      tracksPublicControllerRemoveTrackReaction: build.mutation<
        TracksPublicControllerRemoveTrackReactionResponse,
        TracksPublicControllerRemoveTrackReactionArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/tracks/${queryArg.trackId}/reaction`, method: "DELETE" }),
        invalidatesTags: ["Tracks Public"],
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as generatedApi }
export type TracksPublicControllerGetAllTracksResponse =
  /** status 200 OK: Пагинированный список треков */ GlobalTrackListResponse
export type TracksPublicControllerGetAllTracksArgs = {
  /** Номер страницы для пагинации */
  pageNumber?: number
  /** Размер страницы для пагинации */
  pageSize?: number
  /** Строка для поиска по названию трека */
  search?: string
  sortBy?: "addedAt" | "likesCount"
  sortDirection?: "asc" | "desc"
  tagsIds?: string[]
  artistsIds?: string[]
  userId?: string
}
export type TracksPublicControllerGetPlaylistTracksResponse =
  /** status 200 OK: Список треков в плейлисте */ PlaylistTrackListResponse
export type TracksPublicControllerGetPlaylistTracksArgs = {
  /** ID плейлиста, для которого необходимо получить треки */
  playlistId: string
}
export type TracksPublicControllerGetTrackDetailsResponse =
  /** status 200 OK: Детали трека с вложениями */ TrackDetailsResponse
export type TracksPublicControllerGetTrackDetailsArgs = {
  /** ID трека, для которого необходимо получить детали */
  trackId: string
}
export type TracksPublicControllerLikeTrackResponse =
  /** status 201 OK: Текущая реакция пользователя + суммарные счётчики */ ReactionResponseDto
export type TracksPublicControllerLikeTrackArgs = {
  id: string
}
export type TracksPublicControllerDislikeTrackResponse = /** status 201 OK */ ReactionResponseDto
export type TracksPublicControllerDislikeTrackArgs = {
  id: string
}
export type TracksPublicControllerRemoveTrackReactionResponse = /** status 200 OK */ ReactionResponseDto
export type TracksPublicControllerRemoveTrackReactionArgs = {
  trackId: string
}
export type AttachmentDto = {
  id: string
  addedAt: string
  updatedAt: string
  version: number
  /** Public URL to access the uploaded file */
  url: string
  /** MIME type of the file */
  contentType: string
  /** Original filename uploaded by the user */
  originalName: string
  /** Size of the file in bytes */
  fileSize: number
}
export type ImageDto = {
  type: "original" | "thumbnail" | "medium"
  width: number
  height: number
  fileSize: number
  url: string
}
export type ImagesOutputDto = {
  /** Должен содержать оригинальный размер изображения и миниатюры, например: original, 320x180 и т.п. */
  main?: ImageDto[]
}
export type UserOutputDto = {
  id: string
  name: string
}
export type GlobalTrackListItemAttributesDto = {
  title: string
  addedAt: string
  attachments: AttachmentDto[]
  images: ImagesOutputDto
  user: UserOutputDto
  /** 0 – не залогинен или не реагировал; 1 – лайк; −1 – дизлайк */
  currentUserReaction: 0 | 1 | -1
}
export type RelationshipData = {
  id: string
  type: string
}
export type RelationshipCollection = {
  data: RelationshipData[]
}
export type TrackRelationships = {
  artists: RelationshipCollection
}
export type GlobalTrackListItemJsonApiData = {
  id: string
  type: string
  attributes: GlobalTrackListItemAttributesDto
  relationships: TrackRelationships
}
export type JsonApiMetaWithPaging = {
  totalCount: number
  page: number
  pageSize: number
  pagesCount: number
}
export type OmitTypeClass = {
  name: string
}
export type ArtistJsonApiData = {
  id: string
  type: string
  attributes: OmitTypeClass
}
export type GlobalTrackListResponse = {
  data: GlobalTrackListItemJsonApiData[]
  meta: JsonApiMetaWithPaging
  included: ArtistJsonApiData[]
}
export type PlaylistTrackAttributesDto = {
  title: string
  order: number
  addedAt: string
  updatedAt: string
  attachments: any[]
  images: ImagesOutputDto
  /** 0 (не залогинен или не реагировал), 1 — лайк, -1 — дизлайк */
  currentUserReaction: 0 | 1 | -1
}
export type PlaylistTrackListItemJsonApiData = {
  id: string
  type: string
  attributes: PlaylistTrackAttributesDto
}
export type JsonApiMeta = {
  totalCount: number
}
export type PlaylistTrackListResponse = {
  data: PlaylistTrackListItemJsonApiData[]
  meta: JsonApiMeta
}
export type TagDto = {
  id: string
  name: string
}
export type ArtistDto = {
  id: string
  name: string
}
export type TrackDetailsAttributesDto = {
  title: string
  lyrics?: object
  releaseDate?: object
  addedAt: string
  updatedAt: string
  duration: number
  likesCount: number
  dislikesCount: number
  attachments: AttachmentDto[]
  images: ImageDto[]
  tags: TagDto[]
  artists: ArtistDto[]
  /** 0 – гость или не реагировал, 1 – пользователь лайкнул, -1 – пользователь дизлайкнул */
  currentUserReaction: 0 | 1 | -1
}
export type TrackDetailsData = {
  id: string
  type: string
  attributes: TrackDetailsAttributesDto
}
export type TrackDetailsResponse = {
  data: TrackDetailsData
}
export type ReactionResponseDto = {
  objectId: string
  value: 0 | 1 | -1
  likes: number
  dislikes: number
}
export const {
  useTracksPublicControllerGetAllTracksQuery,
  useTracksPublicControllerGetPlaylistTracksQuery,
  useTracksPublicControllerGetTrackDetailsQuery,
  useTracksPublicControllerLikeTrackMutation,
  useTracksPublicControllerDislikeTrackMutation,
  useTracksPublicControllerRemoveTrackReactionMutation,
} = injectedRtkApi
