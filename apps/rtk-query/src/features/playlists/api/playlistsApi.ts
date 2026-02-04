import { baseApi } from '@/app/api/base-api.ts'
import { CurrentUserReaction } from '@/shared/components'
import type { Images, Nullable, ReactionResponse } from '@/shared/types'

import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  Playlist,
  PlaylistDetail,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from './playlistsApi.types.ts'

export const playlistsAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({ url: 'playlists', params }),
      providesTags: ['Playlist', 'Track'],
    }),
    fetchPlaylistById: build.query<{ data: PlaylistDetail }, string>({
      query: (playlistId) => ({ url: `playlists/${playlistId}` }),
      providesTags: (_result, _error, playlistId) => [{ type: 'Playlist', id: playlistId }],
    }),
    createPlaylist: build.mutation<{ data: PlaylistDetail }, CreatePlaylistArgs>({
      query: ({ title, description }) => ({
        url: 'playlists',
        method: 'POST',
        body: {
          data: {
            type: 'playlists',
            attributes: { title, description },
          },
        },
      }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; payload: UpdatePlaylistArgs }>({
      query: ({ playlistId, payload }) => ({
        url: `playlists/${playlistId}`,
        method: 'PUT',
        body: {
          data: {
            type: 'playlists',
            attributes: payload,
          },
        },
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [
        { type: 'Playlist', id: playlistId },
        'Playlist',
      ],
    }),
    removePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        url: `playlists/${playlistId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, playlistId) => [
        { type: 'Playlist', id: playlistId },
        'Playlist',
      ],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: `playlists/${playlistId}/images/main`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (_result, _error, { playlistId }) => [
        { type: 'Playlist', id: playlistId },
        'Playlist',
      ],
    }),
    reorderPlaylist: build.mutation<void, { playlistId: string; putAfterItemId: Nullable<string> }>(
      {
        query: ({ playlistId, putAfterItemId }) => ({
          url: `playlists/${playlistId}/reorder`,
          method: 'PUT',
          body: { putAfterItemId },
        }),
        invalidatesTags: (_result, _error, { playlistId }) => [
          { type: 'Playlist', id: playlistId },
          'Playlist',
        ],
      }
    ),
    likePlaylist: build.mutation<ReactionResponse, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}/likes`,
        method: 'POST',
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled, getState }) => {
        const patchResults: { undo: () => void }[] = []

        const patchCachedQueries = (
          endpoint: 'fetchPlaylists' | 'fetchPlaylistById',
          recipe: (state: PlaylistsResponse | { data: Playlist }) => void
        ) => {
          const args = playlistsAPI.util.selectCachedArgsForQuery(getState(), endpoint)
          args.forEach((arg) => {
            patchResults.push(dispatch(playlistsAPI.util.updateQueryData(endpoint, arg, recipe)))
          })
        }

        patchCachedQueries('fetchPlaylists', (state) => {
          const playlist = (state as PlaylistsResponse).data.find((x) => x.id === id)
          if (!playlist) return
          playlist.attributes.likesCount += 1
          playlist.attributes.currentUserReaction = CurrentUserReaction.Like
        })

        patchCachedQueries('fetchPlaylistById', (state) => {
          const playlistAttributes = (state as { data: Playlist }).data.attributes
          playlistAttributes.likesCount += 1
          playlistAttributes.currentUserReaction = CurrentUserReaction.Like
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((p) => p.undo())
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Playlist', id }, 'Playlist'],
    }),
    dislikePlaylist: build.mutation<ReactionResponse, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}/dislikes`,
        method: 'POST',
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled, getState }) => {
        const patchResults: { undo: () => void }[] = []

        const patchCachedQueries = (
          endpoint: 'fetchPlaylists' | 'fetchPlaylistById',
          recipe: (state: PlaylistsResponse | { data: Playlist }) => void
        ) => {
          const args = playlistsAPI.util.selectCachedArgsForQuery(getState(), endpoint)
          args.forEach((arg) => {
            patchResults.push(dispatch(playlistsAPI.util.updateQueryData(endpoint, arg, recipe)))
          })
        }

        patchCachedQueries('fetchPlaylists', (state) => {
          const playlist = (state as PlaylistsResponse).data.find((x) => x.id === id)
          if (!playlist) return
          const playlistAttrs = playlist.attributes
          if (playlistAttrs.currentUserReaction === CurrentUserReaction.Like) {
            playlistAttrs.likesCount -= 1
          }
          playlistAttrs.dislikesCount += 1
          playlistAttrs.currentUserReaction = CurrentUserReaction.Dislike
        })

        patchCachedQueries('fetchPlaylistById', (state) => {
          const playlistAttributes = (state as { data: Playlist }).data.attributes
          if (playlistAttributes.currentUserReaction === CurrentUserReaction.Like) {
            playlistAttributes.likesCount -= 1
          }
          playlistAttributes.dislikesCount += 1
          playlistAttributes.currentUserReaction = CurrentUserReaction.Dislike
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((p) => p.undo())
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Playlist', id }, 'Playlist'],
    }),
    unReactionPlaylist: build.mutation<ReactionResponse, { id: string }>({
      query: ({ id }) => ({
        url: `playlists/${id}/reactions`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled, getState }) => {
        const patchResults: { undo: () => void }[] = []

        const patchCachedQueries = (
          endpoint: 'fetchPlaylists' | 'fetchPlaylistById',
          recipe: (state: PlaylistsResponse | { data: Playlist }) => void
        ) => {
          const args = playlistsAPI.util.selectCachedArgsForQuery(getState(), endpoint)
          args.forEach((arg) => {
            patchResults.push(dispatch(playlistsAPI.util.updateQueryData(endpoint, arg, recipe)))
          })
        }

        patchCachedQueries('fetchPlaylists', (state) => {
          const playlist = (state as PlaylistsResponse).data.find((x) => x.id === id)
          if (!playlist) return
          const playlistAttributes = playlist.attributes
          if (playlistAttributes.currentUserReaction === CurrentUserReaction.Like) {
            playlistAttributes.likesCount -= 1
          }
          playlistAttributes.currentUserReaction = CurrentUserReaction.None
        })

        patchCachedQueries('fetchPlaylistById', (state) => {
          const playlistAttributes = (state as { data: Playlist }).data.attributes
          if (playlistAttributes.currentUserReaction === CurrentUserReaction.Like) {
            playlistAttributes.likesCount -= 1
          }
          playlistAttributes.currentUserReaction = CurrentUserReaction.None
        })

        // if (byIdArgs.length) {
        //   byIdArgs.forEach((arg) => {
        //     patchResults.push(
        //       dispatch(
        //         playlistsAPI.util.updateQueryData('fetchPlaylistById', arg, (state) => {
        //           const playlistAttrs = state.data.attributes
        //           if (playlistAttrs.currentUserReaction === CurrentUserReaction.Like) {
        //             playlistAttrs.likesCount -= 1
        //           }
        //           playlistAttrs.currentUserReaction = CurrentUserReaction.None
        //         })
        //       )
        //     )
        //   })
        // }

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((p) => p.undo())
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Playlist', id }, 'Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useFetchPlaylistByIdQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useRemovePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useReorderPlaylistMutation,
  useLikePlaylistMutation,
  useDislikePlaylistMutation,
  useUnReactionPlaylistMutation,
} = playlistsAPI
