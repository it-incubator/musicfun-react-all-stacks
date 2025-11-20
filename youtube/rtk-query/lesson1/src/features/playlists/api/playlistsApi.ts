import { baseApi } from '@/app/api/baseApi.ts'
import { SOCKET_EVENTS } from '@/common/constants'
import { imagesSchema } from '@/common/schemas'
import { subscribeToEvent } from '@/common/socket'
import type { Images } from '@/common/types'
import { withZodCatch } from '@/common/utils'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import { playlistCreateResponseSchema, playlistsResponseSchema } from '@/features/playlists/model/playlists.schemas.ts'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: 'playlists', params }),
      ...withZodCatch(playlistsResponseSchema),
      keepUnusedDataFor: 0,
      onCacheEntryAdded: async (_arg, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) => {
        await cacheDataLoaded

        const unsubscribes = [
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
            const newPlaylist = msg.payload.data
            updateCachedData((state) => {
              state.data.pop()
              state.data.unshift(newPlaylist)
              state.meta.totalCount = state.meta.totalCount + 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
            })
          }),
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg) => {
            const newPlaylist = msg.payload.data
            updateCachedData((state) => {
              const index = state.data.findIndex((playlist) => playlist.id === newPlaylist.id)
              if (index !== -1) {
                state.data[index] = { ...state.data[index], ...newPlaylist }
              }
            })
          }),
        ]

        await cacheEntryRemoved
        unsubscribes.forEach((unsubscribe) => unsubscribe())
      },
      providesTags: ['Playlist'],
    }),
    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs) => ({ method: 'post', url: 'playlists', body }),
      ...withZodCatch(playlistCreateResponseSchema),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({ method: 'delete', url: `playlists/${playlistId}` }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => {
        return { method: 'put', url: `playlists/${playlistId}`, body }
      },
      onQueryStarted: async ({ playlistId, body }, { queryFulfilled, dispatch, getState }) => {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchCollections: any[] = []

        args.forEach((arg) => {
          patchCollections.push(
            dispatch(
              playlistsApi.util.updateQueryData(
                'fetchPlaylists',
                {
                  pageNumber: arg.pageNumber,
                  pageSize: arg.pageSize,
                  search: arg.search,
                },
                (state) => {
                  const index = state.data.findIndex((playlist) => playlist.id === playlistId)
                  if (index !== -1) {
                    state.data[index].attributes = { ...state.data[index].attributes, ...body }
                  }
                },
              ),
            ),
          )
        })

        try {
          await queryFulfilled
        } catch (e) {
          patchCollections.forEach((patchCollection) => {
            patchCollection.undo()
          })
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return { method: 'post', url: `playlists/${playlistId}/images/main`, body: formData }
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({ method: 'delete', url: `playlists/${playlistId}/images/main` }),
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
