import { instance } from "@/common/instance"
import type {
  CreatePlaylistArgs,
  Playlist,
  PlaylistsResponse,
  UpdatePlaylistArgs,
  UploadPlaylistCoverResponse,
} from "./playlistsApi.types.ts"

export const PlaylistQueryKey = "playlists"
export const playlistsEndpoint = "/playlists"

export const playlistsApi = {
  fetchPlaylists: () => {
    return instance.get<PlaylistsResponse>(playlistsEndpoint)
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
    return instance.post<UploadPlaylistCoverResponse>(`${playlistsEndpoint}/${playlistId}/images/main`, formData)
  },
  fetchPlaylistById: (playlistId: string) => {
    return instance.get<{ data: Playlist }>(`${playlistsEndpoint}/${playlistId}`)
  },
}
