import { baseApi as api } from "../app/api/base-api"
export const addTagTypes = ["Tracks Owner"] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      tracksControllerUpdateTrack: build.mutation<TracksControllerUpdateTrackResponse, TracksControllerUpdateTrackArgs>(
        {
          query: (queryArg) => ({
            url: `/api/1.0/playlists/tracks/${queryArg.trackId}`,
            method: "PUT",
            body: queryArg.trackUpdateInputDto,
          }),
          invalidatesTags: ["Tracks Owner"],
        },
      ),
      tracksControllerDeleteTrackCompletely: build.mutation<
        TracksControllerDeleteTrackCompletelyResponse,
        TracksControllerDeleteTrackCompletelyArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/tracks/${queryArg.trackId}`, method: "DELETE" }),
        invalidatesTags: ["Tracks Owner"],
      }),
      tracksControllerReorderTrack: build.mutation<
        TracksControllerReorderTrackResponse,
        TracksControllerReorderTrackArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists/${queryArg.playlistId}/tracks/${queryArg.trackId}/reorder`,
          method: "PUT",
          body: queryArg.reorderTrackInputDto,
        }),
        invalidatesTags: ["Tracks Owner"],
      }),
      tracksControllerAddTrackToPlaylist: build.mutation<
        TracksControllerAddTrackToPlaylistResponse,
        TracksControllerAddTrackToPlaylistArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists/${queryArg.playlistId}/relationships/tracks`,
          method: "POST",
          body: queryArg.addTrackToPlaylistInputDto,
        }),
        invalidatesTags: ["Tracks Owner"],
      }),
      tracksControllerUnbindTrackFromPlaylist: build.mutation<
        TracksControllerUnbindTrackFromPlaylistResponse,
        TracksControllerUnbindTrackFromPlaylistArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists/${queryArg.playlistId}/relationships/tracks/${queryArg.trackId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Tracks Owner"],
      }),
      tracksControllerUploadTrackCover: build.mutation<
        TracksControllerUploadTrackCoverResponse,
        TracksControllerUploadTrackCoverArgs
      >({
        query: (queryArg) => ({
          url: `/api/1.0/playlists/tracks/${queryArg.trackId}/cover`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Tracks Owner"],
      }),
      tracksControllerDeleteTrackCover: build.mutation<
        TracksControllerDeleteTrackCoverResponse,
        TracksControllerDeleteTrackCoverArgs
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/tracks/${queryArg.trackId}/cover`, method: "DELETE" }),
        invalidatesTags: ["Tracks Owner"],
      }),
      tracksControllerUploadTrackMp3: build.mutation<
        TracksControllerUploadTrackMp3Response,
        TracksControllerUploadTrackMp3Args
      >({
        query: (queryArg) => ({ url: `/api/1.0/playlists/tracks/upload`, method: "POST", body: queryArg.body }),
        invalidatesTags: ["Tracks Owner"],
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as generatedApi }
export type TracksControllerUpdateTrackResponse = /** status 200 OK: Трек успешно обновлён */ TrackSingleResponse
export type TracksControllerUpdateTrackArgs = {
  trackId: string
  trackUpdateInputDto: TrackUpdateInputDto
}
export type TracksControllerDeleteTrackCompletelyResponse = unknown
export type TracksControllerDeleteTrackCompletelyArgs = {
  trackId: string
}
export type TracksControllerReorderTrackResponse = unknown
export type TracksControllerReorderTrackArgs = {
  playlistId: string
  trackId: string
  reorderTrackInputDto: ReorderTrackInputDto
}
export type TracksControllerAddTrackToPlaylistResponse = unknown
export type TracksControllerAddTrackToPlaylistArgs = {
  playlistId: string
  addTrackToPlaylistInputDto: AddTrackToPlaylistInputDto
}
export type TracksControllerUnbindTrackFromPlaylistResponse = unknown
export type TracksControllerUnbindTrackFromPlaylistArgs = {
  playlistId: string
  trackId: string
}
export type TracksControllerUploadTrackCoverResponse = /** status 200 OK: Успешная загрузка обложки */ ImagesOutputDto
export type TracksControllerUploadTrackCoverArgs = {
  /** ID трека, которому загружается обложка */
  trackId: string
  /** Файл изображения.<br/>
                      • Имя поля — <code>cover</code><br/>
                      • Допустимые MIME-типы — <code>image/jpeg</code>, <code>image/png</code>, <code>image/gif</code><br/>
                      • Максимальный размер — <code>100 KB</code> */
  body: {
    cover: Blob
  }
}
export type TracksControllerDeleteTrackCoverResponse = unknown
export type TracksControllerDeleteTrackCoverArgs = {
  trackId: string
}
export type TracksControllerUploadTrackMp3Response = /** status 200 OK: Трек успешно создан */ TrackSingleResponse
export type TracksControllerUploadTrackMp3Args = {
  body: {
    title: string
    file: Blob
  }
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
export type TagDto = {
  id: string
  name: string
}
export type ArtistDto = {
  id: string
  name: string
}
export type TrackAttributesDto = {
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
export type TrackSingleData = {
  id: string
  type: string
  attributes: TrackAttributesDto
}
export type TrackSingleResponse = {
  data: TrackSingleData
}
export type TrackUpdateInputDto = {
  title: string
  /** Текст песни (lyrics) */
  lyrics?: string
  releaseDate?: string
  tagIds?: string[]
  artistsIds?: string[]
}
export type ReorderTrackInputDto = {
  /** ID трека, после которого нужно вставить текущий. null - разместить трек в начало списка. */
  putAfterItemId?: string | null
}
export type AddTrackToPlaylistInputDto = {
  /** ID of the track to add to the playlist */
  trackId: string
}
export type ImagesOutputDto = {
  /** Должен содержать оригинальный размер изображения и миниатюры, например: original, 320x180 и т.п. */
  main?: ImageDto[]
}
export const {
  useTracksControllerUpdateTrackMutation,
  useTracksControllerDeleteTrackCompletelyMutation,
  useTracksControllerReorderTrackMutation,
  useTracksControllerAddTrackToPlaylistMutation,
  useTracksControllerUnbindTrackFromPlaylistMutation,
  useTracksControllerUploadTrackCoverMutation,
  useTracksControllerDeleteTrackCoverMutation,
  useTracksControllerUploadTrackMp3Mutation,
} = injectedRtkApi
