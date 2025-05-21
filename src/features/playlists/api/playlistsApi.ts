import { instance } from "@/common/instance/instance.ts"
import type { CreatePlaylistArgs, PlaylistItem, PlaylistsResponse } from "./playlistsApi.types.ts"

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
    return instance.post<{ data: PlaylistItem }>(endpoint, args)
  },
}
