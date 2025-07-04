import { playlistsEndpoint } from '@/common/apiEntities'
import { getInstance } from '@/common/instance'
import type { Images, Nullable, ReactionResponse } from '@/common/types'
import { joinUrl } from '@/common/utils'
import type { CreatePlaylistArgs, Playlist, PlaylistsResponse, UpdatePlaylistArgs } from './playlistsApi.types.ts'

export const playlistsApi = {
  fetchPlaylists: (params: { pageSize?: number; pageNumber: number; search: string }) => {
    return getInstance().get<PlaylistsResponse>(playlistsEndpoint, { params })
  },
  fetchMyPlaylists: () => {
    return getInstance().get<Omit<PlaylistsResponse, 'meta'>>(`${playlistsEndpoint}/my`)
  },
  createPlaylist: (args: CreatePlaylistArgs) => {
    return getInstance().post<{ data: Playlist }>(playlistsEndpoint, args)
  },
  updatePlaylist: (args: { playlistId: string; payload: UpdatePlaylistArgs }) => {
    const { playlistId, payload } = args
    return getInstance().put<void>(`${playlistsEndpoint}/${playlistId}`, payload)
  },
  removePlaylist: (playlistId: string) => {
    return getInstance().delete<void>(`${playlistsEndpoint}/${playlistId}`)
  },
  uploadPlaylistCover: (args: { playlistId: string; file: File }) => {
    const { playlistId, file } = args
    const formData = new FormData()
    formData.append('file', file)
    return getInstance().post<Images>(`${playlistsEndpoint}/${playlistId}/images/main`, formData)
  },
  fetchPlaylistById: (playlistId: string) => {
    return getInstance().get<{ data: Playlist }>(`${playlistsEndpoint}/${playlistId}`)
  },
  reorderPlaylist: ({ playlistId, putAfterItemId }: { playlistId: string; putAfterItemId: Nullable<string> }) => {
    return getInstance().put<void>(`${playlistsEndpoint}/${playlistId}/reorder`, { putAfterItemId })
  },
  like: (id: string) => {
    return getInstance().post<ReactionResponse>(joinUrl(playlistsEndpoint, id, 'likes'))
  },
  dislike: (id: string) => {
    return getInstance().post<ReactionResponse>(joinUrl(playlistsEndpoint, id, 'dislikes'))
  },
  removeReaction: (id: string) => {
    return getInstance().delete<ReactionResponse>(joinUrl(playlistsEndpoint, id, 'reactions'))
  },
}
