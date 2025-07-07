import type { CreatePlaylistArgs, Playlist, PlaylistsResponse, UpdatePlaylistArgs } from './playlistsApi.types.ts'
import { playlistsEndpoint } from '../../common/apiEntities/apiEntities'
import { Images } from '../../common/types/playlists-tracks.types'
import { Nullable } from '../../common/types/common.types'
import { getApiClient } from '../../v2/request'

export const playlistsApi = {
  fetchPlaylists: (params: { pageSize?: number; pageNumber: number; search: string }) => {
    return getApiClient().get<PlaylistsResponse>(playlistsEndpoint, { params })
  },
  fetchMyPlaylists: () => {
    return getApiClient().get<Omit<PlaylistsResponse, 'meta'>>(`${playlistsEndpoint}/my`)
  },
  createPlaylist: (args: CreatePlaylistArgs) => {
    return getApiClient().post<{ data: Playlist }>(playlistsEndpoint, args)
  },
  updatePlaylist: (args: { playlistId: string; payload: UpdatePlaylistArgs }) => {
    const { playlistId, payload } = args
    return getApiClient().put<void>(`${playlistsEndpoint}/${playlistId}`, payload)
  },
  removePlaylist: (playlistId: string) => {
    return getApiClient().delete<void>(`${playlistsEndpoint}/${playlistId}`)
  },
  uploadPlaylistCover: (args: { playlistId: string; file: File }) => {
    const { playlistId, file } = args
    const formData = new FormData()
    formData.append('file', file)
    return getApiClient().post<Images>(`${playlistsEndpoint}/${playlistId}/images/main`, formData)
  },
  fetchPlaylistById: (playlistId: string) => {
    return getApiClient().get<{ data: Playlist }>(`${playlistsEndpoint}/${playlistId}`)
  },
  reorderPlaylist: ({ playlistId, putAfterItemId }: { playlistId: string; putAfterItemId: Nullable<string> }) => {
    return getApiClient().put<void>(`${playlistsEndpoint}/${playlistId}/reorder`, { putAfterItemId })
  },
}
