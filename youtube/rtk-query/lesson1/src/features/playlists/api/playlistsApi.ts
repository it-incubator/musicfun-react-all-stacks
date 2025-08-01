import { baseApi } from '@/app/api/baseApi.ts'
import type {
  CreatePlaylistArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => 'playlists',
      providesTags: ['Playlist'],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({ method: 'post', url: 'playlists', body }),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({ method: 'delete', url: `playlists/${playlistId}` }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({ method: 'put', url: `playlists/${playlistId}`, body }),
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} = playlistsApi
