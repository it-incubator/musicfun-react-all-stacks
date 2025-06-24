import { baseApi } from "@/app/api/base-api.ts"

import type { Images } from "@/common/types"
import type { Nullable } from "@/common/types/common.types"
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  Playlist,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from "./playlistsApi.types.ts"

export const playlistsAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({ url: "playlists", params }),
      providesTags: ["Playlist"],
    }),
    fetchMyPlaylists: build.query<Omit<PlaylistsResponse, "meta">, void>({
      query: () => ({ url: "playlists/my" }),
      providesTags: ["Playlist"],
    }),
    fetchPlaylistById: build.query<{ data: Playlist }, string>({
      query: (playlistId) => ({ url: `playlists/${playlistId}` }),
      providesTags: (_result, _error, playlistId) => [{ type: "Playlist", id: playlistId }],
    }),
    createPlaylist: build.mutation<{ data: Playlist }, CreatePlaylistArgs>({
      query: (body) => ({
        url: "playlists",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Playlist"],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; payload: UpdatePlaylistArgs }>({
      query: ({ playlistId, payload }) => ({
        url: `playlists/${playlistId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: "Playlist", id: playlistId }, "Playlist"],
    }),
    removePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        url: `playlists/${playlistId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, playlistId) => [{ type: "Playlist", id: playlistId }, "Playlist"],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        return {
          url: `playlists/${playlistId}/images/main`,
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: "Playlist", id: playlistId }, "Playlist"],
    }),
    reorderPlaylist: build.mutation<void, { playlistId: string; putAfterItemId: Nullable<string> }>({
      query: ({ playlistId, putAfterItemId }) => ({
        url: `playlists/${playlistId}/reorder`,
        method: "PUT",
        body: { putAfterItemId },
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: "Playlist", id: playlistId }, "Playlist"],
    }),
    likePlaylist: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Playlist", id }, "Playlist"],
    }),
    dislikePlaylist: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}/dislike`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Playlist", id }, "Playlist"],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useFetchMyPlaylistsQuery,
  useFetchPlaylistByIdQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useRemovePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useReorderPlaylistMutation,
  useLikePlaylistMutation,
  useDislikePlaylistMutation,
} = playlistsAPI
