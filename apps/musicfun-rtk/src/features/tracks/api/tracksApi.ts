import type {
  FetchPlaylistsTracksResponse,
  TrackApiResponse,
  FetchTracksArgs,
  FetchTracksResponse,
  TrackDetailAttributes,
  TrackDetails,
  UpdateTrackArgs,
} from './tracksApi.types.ts'
import { baseApi } from '@/app/api/base-api.ts'
import type { Nullable, ReactionResponse } from '@/common/types'
import { buildQueryString } from '@/common/utils'

export const tracksAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1) Fetch operations
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
        const query = buildQueryString(params)

        return `playlists/tracks?${query}`
      },
      providesTags: (result) => [
        ...(result?.data.map((track) => {
          return { type: 'Track' as const, id: track.id }
        }) || []),
        'Track',
      ],
    }),
    fetchTracksInPlaylist: build.query<FetchPlaylistsTracksResponse, FetchTracksArgs & { playlistId: string }>({
      query: ({ playlistId, ...params }) => ({
        url: `playlists/tracks/${playlistId}/tracks`,
        params: params,
      }),
      providesTags: (res) => res?.data.map((track) => ({ type: 'Track', trackId: track.id })) || [],
    }),
    fetchTrackById: build.query<TrackApiResponse, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}`,
      }),
      providesTags: (_, __, { trackId }) => [{ type: 'Track', trackId }],
    }),

    // 2) Create operations
    createTrack: build.mutation<TrackApiResponse, { title: string; file: File }>({
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
          // Don't touch cache on error
        }
      },
      invalidatesTags: ['Track'],
    }),
    publishTrack: build.mutation<void, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `/playlists/tracks/${trackId}/actions/publish`,
        method: 'POST',
      }),
      invalidatesTags: ['Track'],
    }),

    // 3) Update operations
    updateTrack: build.mutation<TrackDetails<TrackDetailAttributes>, { trackId: string; payload: UpdateTrackArgs }>({
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
      invalidatesTags: ['Track'],
    }),
    removeTrackFromPlaylist: build.mutation<void, { playlistId: string; trackId: string }>({
      query: ({ trackId, playlistId }) => ({
        url: `playlists/${playlistId}/relationships/tracks`,
        method: 'POST',
        body: {
          trackId: trackId,
        },
      }),
      async onQueryStarted({ playlistId, trackId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            baseApi.util.invalidateTags([
              'Track',
              { type: 'Playlist', id: playlistId },
              { type: 'Track', id: trackId },
            ]),
          )
        } catch {
          // Don't touch cache on error
        }
      },
      invalidatesTags: (_res, __err, { playlistId, trackId }) => [
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
          // Don't touch cache on error
        }
      },
      invalidatesTags: (_res, _err, { playlistId }) => [{ type: 'Playlist', id: playlistId }],
    }),

    // 4) Delete operations
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
          // Don't touch cache on error
        }
      },
      invalidatesTags: ['Track'],
    }),

    // 5) Reaction operations
    like: build.mutation<ReactionResponse, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/likes`,
        method: 'POST',
      }),
      async onQueryStarted({ trackId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track', { type: 'Track', id: trackId }]))
        } catch {
          // Don't touch cache on error
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    dislike: build.mutation<ReactionResponse, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/dislikes`,
        method: 'POST',
      }),
      async onQueryStarted({ trackId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track', { type: 'Track', id: trackId }]))
        } catch {
          // Don't touch cache on error
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    removeReaction: build.mutation<ReactionResponse, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/reactions`,
        method: 'DELETE',
      }),
      async onQueryStarted({ trackId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util.invalidateTags(['Track', { type: 'Track', id: trackId }]))
        } catch {
          // Don't touch cache on error
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
          // Don't touch cache on error
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
          // Don't touch cache on error
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
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
  useDislikeMutation,
  useFetchTracksInPlaylistQuery,
  useLikeMutation,
  useRemoveTrackMutation,
  useRemoveTrackFromPlaylistMutation,
  useRemoveReactionMutation,
  useUpdateTrackMutation,
  usePublishTrackMutation,
  useReorderTracksMutation,
} = tracksAPI
