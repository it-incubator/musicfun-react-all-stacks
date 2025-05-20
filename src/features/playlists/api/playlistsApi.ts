import { instance } from "@/common/instance/instance.ts"
import type { PlaylistItem, PlaylistsResponse } from "./playlistsApi.types.ts"

const endpoint = "/playlists"

export const playlistsApi = {
  getPlaylists: () => {
    return instance.get<PlaylistsResponse>(endpoint)
  },
  getMyPlaylists: () => {
    return instance.get<Omit<PlaylistsResponse, "meta">>(`${endpoint}/my`)
  },
  createPlaylist: (args: { title: string; description: string }) => {
    return instance.post<{ data: PlaylistItem }>(endpoint, args)
  },
}
