import { instance } from "@/common/instance/instance.ts"
import type { CreatePlaylistArgs, Playlist, PlaylistsResponse, UpdatePlaylistArgs } from "./playlistsApi.types.ts"

export const PlaylistQueryKey = "playlists"
const endpoint = "/playlists"

export const playlistsApi = {
  getPlaylists: () => {
    return instance.get<PlaylistsResponse>(endpoint)
  },
  getMyPlaylists: () => {
    return instance.get<Omit<PlaylistsResponse, "meta">>(`${endpoint}/my`)
  },
  createPlaylist: (args: CreatePlaylistArgs) => {
    return instance.post<{ data: Playlist }>(endpoint, args)
  },
  updatePlaylist: (args: { playlistId: string; payload: UpdatePlaylistArgs }) => {
    const { playlistId, payload } = args
    return instance.put<void>(`${endpoint}/${playlistId}`, payload)
  },
  removePlaylist: (playlistId: string) => {
    return instance.delete<void>(`${endpoint}/${playlistId}`)
  },
}
