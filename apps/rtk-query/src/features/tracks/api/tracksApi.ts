import { baseApi } from '@/app/api/base-api.ts'
import { FETCH_TRACK_BY_SCROLL_PAGE_SIZE } from '@/features/tracks/constants'
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
    fetchTracksByScroll: build.infiniteQuery<
      FetchTracksResponse,
      FetchTracksArgs | void,
      string | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          return lastPage.meta.nextCursor || null
        },
      },

      query: (args) => {
        const { pageParam, ...params } = args as any
        return {
          url: 'playlists/tracks',
          params: {
            cursor: pageParam,
            paginationType: 'cursor',
            pageSize: FETCH_TRACK_BY_SCROLL_PAGE_SIZE,
            ...params,
          },
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.pages.flatMap((page) =>
                page.data.map((track) => ({ type: 'Track' as const, id: track.id }))
              ),
              { type: 'Track', id: 'LIST' },
            ]
          : [{ type: 'Track', id: 'LIST' }],
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
      providesTags: (_, __, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    createTrack: build.mutation<
      { data: TrackDetails<TrackDetailAttributes> },
      { title: string; file: File }
    >({
      query: ({ title, file }) => {
        const formData = new FormData()
        formData.append('data[type]', 'tracks')
        formData.append('data[attributes][title]', title)
        formData.append('file', file)

        return {
          url: `playlists/tracks/upload`,
          method: 'POST',
          body: formData,
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
        body: {
          data: {
            type: 'tracks',
            attributes: payload,
          },
        },
      }),

      invalidatesTags: ['Track'],
    }),
    addTrackToPlaylist: build.mutation<void, { playlistId: string; trackId: string }>({
      query: ({ trackId, playlistId }) => ({
        url: `playlists/${playlistId}/relationships/tracks`,
        method: 'POST',
        body: {
          data: {
            type: 'playlist-tracks',
            attributes: {
              trackId: trackId,
            },
          },
        },
      }),
      invalidatesTags: ['Track', 'Playlist'],
    }),
    removeTrackFromPlaylist: build.mutation<void, { playlistId: string; trackId: string }>({
      query: ({ trackId, playlistId }) => ({
        url: `playlists/${playlistId}/relationships/tracks/${trackId}`,
        method: 'DELETE',
      }),
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
      invalidatesTags: (_res, _err, { playlistId }) => [{ type: 'Playlist', id: playlistId }],
    }),
    removeTrack: build.mutation<void, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Track'],
    }),
    likeTrack: build.mutation<ReactionResponse, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/likes`,
        method: 'POST',
      }),
      async onQueryStarted({ trackId }, { dispatch, getState, queryFulfilled }) {
        const patchResults: any[] = []

        // Refresh the cache for a single track page (fetchTrackById)
        const patchTrackById = dispatch(
          tracksAPI.util.updateQueryData('fetchTrackById', { trackId }, (state) => {
            if (state.data.attributes.currentUserReaction === CurrentUserReaction.Dislike) {
              state.data.attributes.dislikesCount -= 1
            }
            state.data.attributes.likesCount += 1
            state.data.attributes.currentUserReaction = CurrentUserReaction.Like
          })
        )
        patchResults.push(patchTrackById)

        // Refresh cache for infinite scroll (fetchTracksByScroll)
        const scrollArgs = tracksAPI.util.selectCachedArgsForQuery(
          getState(),
          'fetchTracksByScroll'
        )
        if (scrollArgs) {
          scrollArgs.forEach((scrollArg) => {
            patchResults.push(
              dispatch(
                tracksAPI.util.updateQueryData('fetchTracksByScroll', scrollArg, (state) => {
                  // Go through all pages
                  state.pages.forEach((page) => {
                    const track = page.data.find((t: any) => t.id === trackId)
                    if (track) {
                      if (track.attributes.currentUserReaction === CurrentUserReaction.Dislike) {
                        track.attributes.dislikesCount -= 1
                      }
                      track.attributes.likesCount += 1
                      track.attributes.currentUserReaction = CurrentUserReaction.Like
                    }
                  })
                })
              )
            )
          })
        }

        // Refresh the cache for track lists (fetchTracks)
        const args = tracksAPI.util.selectCachedArgsForQuery(getState(), 'fetchTracks')
        args.forEach((arg: FetchTracksArgs) => {
          patchResults.push(
            dispatch(
              tracksAPI.util.updateQueryData('fetchTracks', arg || {}, (state) => {
                const track = state.data.find((t) => t.id === trackId)
                if (track) {
                  if (track.attributes.currentUserReaction === CurrentUserReaction.Dislike) {
                    track.attributes.dislikesCount -= 1
                  }
                  track.attributes.likesCount += 1
                  track.attributes.currentUserReaction = CurrentUserReaction.Like
                }
              })
            )
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((p) => p.undo())
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    dislikeTrack: build.mutation<ReactionResponse, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/dislikes`,
        method: 'POST',
      }),
      async onQueryStarted({ trackId }, { dispatch, getState, queryFulfilled }) {
        const patchResults: any[] = []

        // --- ИСПРАВЛЕНИЕ: Обновляем кеш для страницы одного трека (fetchTrackById) ---
        const patchTrackById = dispatch(
          tracksAPI.util.updateQueryData('fetchTrackById', { trackId }, (state) => {
            if (state.data.attributes.currentUserReaction === CurrentUserReaction.Like) {
              state.data.attributes.likesCount -= 1
            }
            state.data.attributes.dislikesCount += 1
            state.data.attributes.currentUserReaction = CurrentUserReaction.Dislike
          })
        )
        patchResults.push(patchTrackById)

        // Refresh cache for infinite scroll (fetchTracksByScroll)
        const scrollArgs = tracksAPI.util.selectCachedArgsForQuery(
          getState(),
          'fetchTracksByScroll'
        )
        if (scrollArgs) {
          scrollArgs.forEach((scrollArg) => {
            patchResults.push(
              dispatch(
                tracksAPI.util.updateQueryData('fetchTracksByScroll', scrollArg, (state) => {
                  // Go through all pages
                  state.pages.forEach((page) => {
                    const track = page.data.find((t: any) => t.id === trackId)
                    if (track) {
                      if (track.attributes.currentUserReaction === CurrentUserReaction.Like) {
                        track.attributes.likesCount -= 1
                      }
                      track.attributes.dislikesCount += 1
                      track.attributes.currentUserReaction = CurrentUserReaction.Dislike
                    }
                  })
                })
              )
            )
          })
        }

        // Refresh the cache for track lists (fetchTracks)
        const args = tracksAPI.util.selectCachedArgsForQuery(getState(), 'fetchTracks')
        args.forEach((arg: FetchTracksArgs) => {
          patchResults.push(
            dispatch(
              tracksAPI.util.updateQueryData('fetchTracks', arg || {}, (state) => {
                const track = state.data.find((t) => t.id === trackId)
                if (track) {
                  if (track.attributes.currentUserReaction === CurrentUserReaction.Like) {
                    track.attributes.likesCount -= 1
                  }
                  track.attributes.dislikesCount += 1
                  track.attributes.currentUserReaction = CurrentUserReaction.Dislike
                }
              })
            )
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((p) => p.undo())
        }
      },
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    unReactionTrack: build.mutation<ReactionResponse, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/reactions`,
        method: 'DELETE',
      }),
      async onQueryStarted({ trackId }, { dispatch, getState, queryFulfilled }) {
        const patchResults: any[] = []

        // Refresh the cache for a single track page (fetchTrackById)
        const patchTrackById = dispatch(
          tracksAPI.util.updateQueryData('fetchTrackById', { trackId }, (state) => {
            if (state.data.attributes.currentUserReaction === CurrentUserReaction.Like) {
              state.data.attributes.likesCount -= 1
            } else if (state.data.attributes.currentUserReaction === CurrentUserReaction.Dislike) {
              state.data.attributes.dislikesCount -= 1
            }
            state.data.attributes.currentUserReaction = CurrentUserReaction.None
          })
        )
        patchResults.push(patchTrackById)

        // Refresh cache for infinite scroll (fetchTracksByScroll)
        const scrollArgs = tracksAPI.util.selectCachedArgsForQuery(
          getState(),
          'fetchTracksByScroll'
        )
        scrollArgs.forEach((scrollArg) => {
          patchResults.push(
            dispatch(
              tracksAPI.util.updateQueryData('fetchTracksByScroll', scrollArg, (state) => {
                // Go through all pages
                state.pages.forEach((page) => {
                  const track = page.data.find((t: any) => t.id === trackId)
                  if (track) {
                    if (track.attributes.currentUserReaction === CurrentUserReaction.Like) {
                      track.attributes.likesCount -= 1
                    } else if (
                      track.attributes.currentUserReaction === CurrentUserReaction.Dislike
                    ) {
                      track.attributes.dislikesCount -= 1
                    }
                    track.attributes.currentUserReaction = CurrentUserReaction.None
                  }
                })
              })
            )
          )
        })

        // Refresh the cache for track lists (fetchTracks)
        const args = tracksAPI.util.selectCachedArgsForQuery(getState(), 'fetchTracks')
        args.forEach((arg: FetchTracksArgs) => {
          patchResults.push(
            dispatch(
              tracksAPI.util.updateQueryData('fetchTracks', arg || {}, (state) => {
                const track = state.data.find((t) => t.id === trackId)
                if (track) {
                  if (track.attributes.currentUserReaction === CurrentUserReaction.Like) {
                    track.attributes.likesCount -= 1
                  } else if (track.attributes.currentUserReaction === CurrentUserReaction.Dislike) {
                    track.attributes.dislikesCount -= 1
                  }
                  track.attributes.currentUserReaction = CurrentUserReaction.None
                }
              })
            )
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((p) => p.undo())
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
      invalidatesTags: (_res, _err, { trackId }) => [{ type: 'Track', id: trackId }],
    }),
    deleteCoverFromTrack: build.mutation<void, { trackId: string }>({
      query: ({ trackId }) => ({
        url: `playlists/tracks/${trackId}/cover`,
        method: 'DELETE',
      }),
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
  useFetchTracksByScrollInfiniteQuery,
  useLazyFetchTrackByIdQuery,
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
