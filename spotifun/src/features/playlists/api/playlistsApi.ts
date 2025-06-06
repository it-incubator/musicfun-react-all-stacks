import { playlistsEndpoint } from "@/common/apiEntities"
import { instance } from "@/common/instance"
import type { Images, Nullable } from "@/common/types"
import type { CreatePlaylistArgs, Playlist, PlaylistsResponse, UpdatePlaylistArgs } from "./playlistsApi.types.ts"

export const playlistsApi = {
  fetchPlaylists: (params: { pageSize?: number; pageNumber: number; search: string }) => {
    return instance.get<PlaylistsResponse>(playlistsEndpoint, { params })
  },
  fetchMyPlaylists: () => {
    return instance.get<Omit<PlaylistsResponse, "meta">>(`${playlistsEndpoint}/my`)
  },
  createPlaylist: (args: CreatePlaylistArgs) => {
    return instance.post<{ data: Playlist }>(playlistsEndpoint, args)
  },
  updatePlaylist: (args: { playlistId: string; payload: UpdatePlaylistArgs }) => {
    const { playlistId, payload } = args
    return instance.put<void>(`${playlistsEndpoint}/${playlistId}`, payload)
  },
  removePlaylist: (playlistId: string) => {
    return instance.delete<void>(`${playlistsEndpoint}/${playlistId}`)
  },
  uploadPlaylistCover: (args: { playlistId: string; file: File }) => {
    const { playlistId, file } = args
    const formData = new FormData()
    formData.append("file", file)
    return instance.post<Images>(`${playlistsEndpoint}/${playlistId}/images/main`, formData)
  },
  fetchPlaylistById: (playlistId: string) => {
    return instance.get<{ data: Playlist }>(`${playlistsEndpoint}/${playlistId}`)
  },
  reorderPlaylist: ({ playlistId, putAfterItemId }: { playlistId: string; putAfterItemId: Nullable<string> }) => {
    return instance.put<void>(`${playlistsEndpoint}/${playlistId}/reorder`, { putAfterItemId })
  },
}
