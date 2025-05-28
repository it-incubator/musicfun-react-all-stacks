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
import { joinUrl } from "@/common/utils/urlHelper.ts"

export const TrackQueryKey = "tracks"
const tracksEndpoint = "tracks"
const relationshipsSegment = "relationships"

export const tracksApi = {
  fetchTracks: () => {
    return instance.get<FetchTracksResponse>(joinUrl(playlistsEndpoint, tracksEndpoint))
  },

  fetchTracksInPlaylist: ({ playlistId }: { playlistId: string }) => {
    return instance.get<FetchPlaylistsTracksResponse>(joinUrl(playlistsEndpoint, playlistId, tracksEndpoint))
  },

  fetchTrackById: (trackId: string) => {
    return instance.get<{ data: TrackDetails<TrackDetailAttributes> }>(
      joinUrl(playlistsEndpoint, tracksEndpoint, trackId),
    )
  },

  createTrack: ({ playlistId, title, file }: { playlistId: string; title: string; file: File }) => {
    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)

    return instance.post<{ data: TrackDetails<TrackDetailAttributes> }>(
      joinUrl(playlistsEndpoint, playlistId, tracksEndpoint, "upload"),
      formData,
    )
  },

  removeTrack: (trackId: string) => {
    return instance.delete<void>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId))
  },

  uploadTrackCover: ({ playlistId, trackId, file }: { playlistId: string; trackId: string; file: File }) => {
    const formData = new FormData()
    formData.append("file", file)

    return instance.post<unknown>(joinUrl(playlistsEndpoint, playlistId, tracksEndpoint, trackId, "cover"), formData)
  },

  updateTrack: ({
    playlistId,
    trackId,
    payload,
  }: {
    playlistId: string
    trackId: string
    payload: UpdateTrackArgs
  }) => {
    return instance.put<UpdateTrackResponse>(joinUrl(playlistsEndpoint, playlistId, tracksEndpoint, trackId), payload)
  },

  addTrackToPlaylist: ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
    return instance.post<void>(joinUrl(playlistsEndpoint, playlistId, relationshipsSegment, tracksEndpoint), {
      trackId,
    })
  },

  removeTrackFromPlaylist: ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
    return instance.delete<void>(joinUrl(playlistsEndpoint, playlistId, relationshipsSegment, tracksEndpoint, trackId))
  },
}
