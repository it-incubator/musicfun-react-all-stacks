import { instance } from "@/common/instance"
import { playlistsEndpoint } from "@/features/playlists/api/playlistsApi.ts"
import type {
  FetchPlaylistsTracksResponse,
  FetchTracksResponse,
  TrackDetailAttributes,
  TrackDetails,
  UpdateTrackArgs,
  UpdateTrackResponse,
} from "./tracksApi.types.ts"

export const TrackQueryKey = "tracks"
const tracksEndpoint = "/tracks"

export const tracksApi = {
  fetchTracks: () => {
    return instance.get<FetchTracksResponse>(`${playlistsEndpoint}${tracksEndpoint}`)
  },
  fetchTracksInPlaylist: (args: { playlistId: string }) => {
    const { playlistId } = args
    return instance.get<FetchPlaylistsTracksResponse>(`${playlistsEndpoint}/${playlistId}${tracksEndpoint}`)
  },
  fetchTrackById: (trackId: string) => {
    return instance.get<{
      data: TrackDetails<TrackDetailAttributes>
    }>(`${playlistsEndpoint}${tracksEndpoint}/${trackId}`)
  },
  createTrack: (args: { playlistId: string; title: string; file: File }) => {
    const { playlistId, title, file } = args
    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)
    return instance.post<{
      data: TrackDetails<TrackDetailAttributes>
    }>(`${playlistsEndpoint}/${playlistId}${tracksEndpoint}/upload`, formData)
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
  updateTrack: (args: { playlistId: string; trackId: string; payload: UpdateTrackArgs }) => {
    const { playlistId, trackId, payload } = args
    return instance.put<UpdateTrackResponse>(`${playlistsEndpoint}/${playlistId}${tracksEndpoint}/${trackId}`, payload)
  },
  addTrackToPlaylist: (args: { playlistId: string; trackId: string }) => {
    const { playlistId, trackId } = args
    return instance.post<void>(`${playlistsEndpoint}/${playlistId}/relationships${tracksEndpoint}`, { trackId })
  },
  removeTrackFromPlaylist: (args: { playlistId: string; trackId: string }) => {
    const { playlistId, trackId } = args
    return instance.delete<void>(`${playlistsEndpoint}/${playlistId}/relationships${tracksEndpoint}/${trackId}`)
  },
}
