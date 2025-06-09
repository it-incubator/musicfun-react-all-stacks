import { playlistsEndpoint, tracksEndpoint } from "@/common/apiEntities"
import { instance } from "@/common/instance"
import type { Cover, Nullable } from "@/common/types"
import { joinUrl } from "@/common/utils"
import type {
  FetchPlaylistsTracksResponse,
  FetchTracksResponse,
  ReactionResponse,
  TrackDetailAttributes,
  TrackDetails,
  UpdateTrackArgs,
} from "./tracksApi.types.ts"

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

  createTrack: ({ title, file }: { title: string; file: File }) => {
    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)
    return instance.post<{ data: TrackDetails<TrackDetailAttributes> }>(
      joinUrl(playlistsEndpoint, tracksEndpoint, "upload"),
      formData,
    )
  },

  removeTrack: (trackId: string) => {
    return instance.delete<void>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId))
  },

  uploadTrackCover: ({ trackId, file }: { trackId: string; file: File }) => {
    const formData = new FormData()
    formData.append("cover", file)
    return instance.post<Cover>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, "cover"), formData)
  },

  updateTrack: ({ trackId, payload }: { trackId: string; payload: UpdateTrackArgs }) => {
    return instance.put<{
      data: TrackDetails<TrackDetailAttributes>
    }>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId), payload)
  },

  addTrackToPlaylist: ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
    return instance.post<void>(joinUrl(playlistsEndpoint, playlistId, "relationships", tracksEndpoint), {
      trackId,
    })
  },

  removeTrackFromPlaylist: ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
    return instance.delete<void>(joinUrl(playlistsEndpoint, playlistId, "relationships", tracksEndpoint, trackId))
  },

  reorderTracks: ({
    trackId,
    playlistId,
    putAfterItemId,
  }: {
    trackId: string
    playlistId: string
    putAfterItemId: Nullable<string>
  }) => {
    return instance.put<void>(joinUrl(playlistsEndpoint, playlistId, tracksEndpoint, trackId, "reorder"), {
      putAfterItemId,
    })
  },

  like: (trackId: string) => {
    return instance.post<ReactionResponse>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, "like"))
  },

  dislike: (trackId: string) => {
    return instance.post<ReactionResponse>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, "dislike"))
  },
}
