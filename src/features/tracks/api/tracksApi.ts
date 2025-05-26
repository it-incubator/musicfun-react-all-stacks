import { instance } from "@/common"
import { playlistsEndpoint } from "@/features/playlists/api/playlistsApi.ts"
import type { CreateTrackResponse, FetchTracksResponse } from "./tracksApi.types.ts"

export const TrackQueryKey = "tracks"
const tracksEndpoint = "/tracks"

export const tracksApi = {
  fetchTracks: () => {
    return instance.get<FetchTracksResponse>(`${playlistsEndpoint}${tracksEndpoint}`)
  },
  createTrack: (args: { playlistId: string; title: string; file: File }) => {
    const { playlistId, title, file } = args
    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)
    return instance.post<CreateTrackResponse>(`${playlistsEndpoint}/${playlistId}${tracksEndpoint}/upload`, formData)
  },
  removeTrack: (trackId: string) => {
    return instance.delete<void>(`${playlistsEndpoint}${tracksEndpoint}/${trackId}`)
  },
  uploadTrackCover: (args: { playlistId: string; trackId: string; file: File }) => {
    const { playlistId, file, trackId } = args
    const formData = new FormData()
    formData.append("file", file)
    return instance.post<unknown>(`${playlistsEndpoint}/${playlistId}${tracksEndpoint}/${trackId}/cover`, formData)
  },
}
