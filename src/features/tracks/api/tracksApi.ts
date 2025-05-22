import { instance } from "@/common"
import { playlistsEndpoint } from "@/features/playlists/api/playlistsApi.ts"
import type { CreateTaskArgs, CreateTrackResponse, FetchTracksResponse } from "./tracksApi.types.ts"

export const TrackQueryKey = "tracks"
const tracksEndpoint = "/tracks"

export const tracksApi = {
  fetchTracks: () => {
    return instance.get<FetchTracksResponse>(`${playlistsEndpoint}${tracksEndpoint}`)
  },
  createTrack: (args: CreateTaskArgs) => {
    const { playlistId, file, title } = args
    return instance.post<CreateTrackResponse>(`${playlistsEndpoint}/${playlistId}/${tracksEndpoint}/upload`, {
      title,
      file,
    })
  },
}
