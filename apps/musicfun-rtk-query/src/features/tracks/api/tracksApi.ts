import { baseApi } from '@/app/api/base-api.ts'
import { CurrentUserReaction, type Nullable, type ReactionResponse } from '@/shared/types'
import { buildQueryString } from '@/shared/utils'

import type {
  FetchPlaylistsTracksResponse,
  FetchTrackByIdResponse,
  FetchTracksArgs,
  FetchTracksResponse,
  TrackDetailAttributes,
  TrackDetails,
  UpdateTrackArgs,
} from './tracksApi.types.ts'

export const tracksAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracksInfinity: build.query<FetchTracksResponse, FetchTracksArgs>({
      query: (params) => {
        const query = buildQueryString(params)
        return `playlists/tracks?${query}`
      },

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { pageNumber, ...otherParams } = queryArgs
        return [endpointName, otherParams]
      },

      merge: (currentCacheData, responseData, { arg }) => {
        const currentPage = arg.pageNumber

        if (currentPage === 1) {
          return responseData
        }

        if (!currentCacheData?.data || !responseData?.data) {
          return responseData
        }

        return {
          ...responseData,
          data: [...currentCacheData.data, ...responseData.data],
        }
      },

      forceRefetch: ({ currentArg, previousArg }) => {
        if (!previousArg) return false
        return currentArg?.pageNumber !== previousArg?.pageNumber
      },

      providesTags: (result) => [
        ...(result?.data.map((track) => {
          return { type: 'Track' as const, id: track.id }
        }) || []),
        'Track',
      ],

      keepUnusedDataFor: 60,
    }),
    fetchTracks: build.query<FetchTracksResponse, FetchTracksArgs>({
      query: (params) => {
        const query = buildQueryString(params) // TODO: возможно, это излишне

        return `playlists/tracks?${query}`
      },
      providesTags: (result) => [
        ...(result?.data.map((track) => {
          return { type: 'Track' as const, id: track.id }
        }) || []),
        'Track',
      ],
    }),
    fetchTracksInPlaylist: build.query<
      FetchPlaylistsTracksResponse,
      FetchTracksArgs & { playlistId: string }
    >({
      query: ({ playlistId, ...params }) => ({
        url: `playlists/${playlistId}/tracks`,
        params: params,
      }),
      providesTags: (res) => res?.data.map((track) => ({ type: 'Track', trackId: track.id })) || [],
    }),
    fetchTrackById: build.query<FetchTrackByIdResponse, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}`,
      }),
      providesTags: (_, __, { trackId }) => [{ type: 'Track', trackId }],
    }),
    createTrack: build.mutation<
      { data: TrackDetails<TrackDetailAttributes> },
      { title: string; file: File }
    >({
      query: ({ title, file }) => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('file', file)

        return {
          url: `playlists/tracks/upload`,
          method: 'POST',
          body: formData,
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track']))
        } catch {
          // При ошибке кеш не трогаем
        }
      },
      invalidatesTags: ['Track'],
    }),
    updateTrack: build.mutation<
      TrackDetails<TrackDetailAttributes>,
      { trackId: string; payload: UpdateTrackArgs }
    >({
      query: ({ trackId, payload }) => ({
        url: `playlists/tracks/${trackId}`,
        method: 'PUT',
        body: payload,
      }),

      invalidatesTags: ['Track'],
    }),
    addTrackToPlaylist: build.mutation<void, { playlistId: string; trackId: string }>({
      query: ({ trackId, playlistId }) => ({
        url: `playlists/${playlistId}/relationships/tracks`,
        method: 'POST',
        body: {
          trackId: trackId,
        },
      }),
      invalidatesTags: ['Track', 'Playlist'],
    }),
    removeTrackFromPlaylist: build.mutation<void, { playlistId: string; trackId: string }>({
      query: ({ trackId, playlistId }) => ({
        url: `playlists/${playlistId}/relationships/tracks/${trackId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ playlistId, trackId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            baseApi.util.invalidateTags([
              'Track',
              { type: 'Playlist', id: playlistId },
              { type: 'Track', id: trackId },
            ])
          )
        } catch {
          // При ошибке кеш не трогаем
        }
      },
      invalidatesTags: (_res, __err, { playlistId, trackId }) => [
        'Playlist',
        { type: 'Playlist', id: playlistId },
        { type: 'Track', id: trackId },
      ],
    }),
    reorderTracks: build.mutation<
      void,
      {
        trackId: string
        playlistId: string
        putAfterItemId: Nullable<string>
      }
    >({
      query: ({ trackId, playlistId, putAfterItemId }) => ({
        url: `playlists/${playlistId}/tracks/${trackId}/reorder`,
        method: 'PUT',
        body: {
          putAfterItemId: putAfterItemId,
        },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track']))
        } catch {
          // При ошибке кеш не трогаем
        }
      },
      invalidatesTags: (_res, _err, { playlistId }) => [{ type: 'Playlist', id: playlistId }],
    }),
    removeTrack: build.mutation<void, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track']))
        } catch {
          // При ошибке кеш не трогаем
        }
      },
      invalidatesTags: ['Track'],
    }),
    likeTrack: build.mutation<ReactionResponse, { trackId: string, fetchTracksArgs?: FetchTracksArgs }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/likes`,
        method: 'POST',
      }),
      async onQueryStarted({ trackId, fetchTracksArgs }, { dispatch, queryFulfilled }) {
        // debugger
        const patchResult = dispatch(
          tracksAPI.util.updateQueryData('fetchTracks', fetchTracksArgs || {}, (state) => {
            const track = state.data.find((t) => t.id === trackId);
            if (track) {
              track.attributes.likesCount += 1
              track.attributes.currentUserReaction = CurrentUserReaction.Like
            }
          })
        );

        // this is for updating the cache fetchTrackById
        const patchResultSingleTrack = dispatch(
          tracksAPI.util.updateQueryData('fetchTrackById', { trackId }, (state) => {
            // draft here is a separate track object, not an array
            state.data.attributes.likesCount += 1;
            state.data.attributes.currentUserReaction = CurrentUserReaction.Like;
          })
        );

        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track', { type: 'Track', id: trackId }]))
        } catch {
          patchResult.undo();
          patchResultSingleTrack.undo();
          // При ошибке кеш не трогаем
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    dislikeTrack: build.mutation<ReactionResponse, { trackId: string, fetchTracksArgs?: FetchTracksArgs }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/dislikes`,
        method: 'POST',
      }),
      async onQueryStarted({ trackId, fetchTracksArgs }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tracksAPI.util.updateQueryData('fetchTracks', fetchTracksArgs || {}, (state) => {
            const track = state.data.find((t) => t.id === trackId);
            if (track) {
              if (track.attributes.currentUserReaction === CurrentUserReaction.Like) {
                track.attributes.likesCount -= 1
              }
              track.attributes.dislikesCount += 1
              track.attributes.currentUserReaction = CurrentUserReaction.Dislike
            }
          })
        );

        const patchResultSingleTrack = dispatch(
          tracksAPI.util.updateQueryData('fetchTrackById', { trackId }, (state) => {
            if (state.data.attributes.currentUserReaction === CurrentUserReaction.Like) {
              state.data.attributes.likesCount -= 1;
            }
            state.data.attributes.dislikesCount += 1;
            state.data.attributes.currentUserReaction = CurrentUserReaction.Dislike;
          })
        );

        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags(['Track', { type: 'Track', id: trackId }]))
        } catch {
          patchResult.undo();
          patchResultSingleTrack.undo();
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    unReactionTrack: build.mutation<ReactionResponse, { trackId: string, fetchTracksArgs?: FetchTracksArgs }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/reactions`,
        method: 'DELETE',
      }),
      async onQueryStarted({ trackId, fetchTracksArgs }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tracksAPI.util.updateQueryData('fetchTracks', fetchTracksArgs || {}, (state) => {
            const track = state.data.find((t) => t.id === trackId);
            if (track) {
              if (track.attributes.currentUserReaction === CurrentUserReaction.Like) {
                track.attributes.likesCount -= 1
              } else if (track.attributes.currentUserReaction === CurrentUserReaction.Dislike) {
                track.attributes.dislikesCount -= 1
              }
              track.attributes.currentUserReaction = CurrentUserReaction.None
            }
          })
        );

        const patchResultSingleTrack = dispatch(
          tracksAPI.util.updateQueryData('fetchTrackById', { trackId }, (state) => {
            if (state.data.attributes.currentUserReaction === CurrentUserReaction.Like) {
              state.data.attributes.likesCount -= 1;
            } else if (state.data.attributes.currentUserReaction === CurrentUserReaction.Dislike) {
              state.data.attributes.dislikesCount -= 1;
            }
            state.data.attributes.currentUserReaction = CurrentUserReaction.None;
          })
        );

        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags(['Track', { type: 'Track', id: trackId }]))
        } catch {
          patchResult.undo();
          patchResultSingleTrack.undo();
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    addCoverToTrack: build.mutation<void, { trackId: string; cover: File }>({
      query: ({ trackId, cover }) => {
        const formData = new FormData()
        formData.append('cover', cover)

        return {
          url: `playlists/tracks/${trackId}/cover`,
          method: 'POST',
          body: formData,
        }
      },
      async onQueryStarted({ trackId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track', { type: 'Track', id: trackId }]))
        } catch {
          // При ошибке кеш не трогаем
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    deleteCoverFromTrack: build.mutation<void, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/cover`,
        method: 'DELETE',
      }),
      async onQueryStarted({ trackId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track', { type: 'Track', id: trackId }]))
        } catch {
          // При ошибке кеш не трогаем
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    publishTrack: build.mutation<void, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/actions/publish`,
        method: 'POST',
      }),
      invalidatesTags: ['Track'],
    }),
  }),
})

export const {
  useFetchTracksInfinityQuery,
  useFetchTracksQuery,
  useFetchTrackByIdQuery,
  useAddCoverToTrackMutation,
  useDeleteCoverFromTrackMutation,
  useAddTrackToPlaylistMutation,
  useCreateTrackMutation,
  useDislikeTrackMutation,
  useFetchTracksInPlaylistQuery,
  useLikeTrackMutation,
  useRemoveTrackMutation,
  useRemoveTrackFromPlaylistMutation,
  useUnReactionTrackMutation,
  useUpdateTrackMutation,
  useReorderTracksMutation,
  usePublishTrackMutation,
} = tracksAPI