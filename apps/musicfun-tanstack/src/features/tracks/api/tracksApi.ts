import { playlistsEndpoint, tracksEndpoint } from '@/common/apiEntities'
import { getInstance } from '@/common/instance'
import type { Cover, Nullable, ReactionResponse } from '@/common/types'
import type {
  FetchPlaylistsTracksResponse,
  FetchTracksArgs,
  FetchTracksResponse,
  TrackDetailAttributes,
  TrackDetails,
  UpdateTrackArgs,
} from './tracksApi.types.ts'
import { joinUrl } from '@/common/utils/urlHelper.ts'

export const tracksApi = {
  fetchTracks: ({ pageSize = 3, pageNumber, search = '' }: FetchTracksArgs) => {
    return getInstance().get<FetchTracksResponse>(joinUrl(playlistsEndpoint, tracksEndpoint), {
      params: {
        pageSize,
        pageNumber,
        search,
      },
    })
  },
  fetchTracksInPlaylist: ({ playlistId }: { playlistId: string }) => {
    return getInstance().get<FetchPlaylistsTracksResponse>(joinUrl(playlistsEndpoint, playlistId, tracksEndpoint))
  },
  fetchTrackById: (trackId: string) => {
    return getInstance().get<{ data: TrackDetails<TrackDetailAttributes> }>(
      joinUrl(playlistsEndpoint, tracksEndpoint, trackId),
    )
  },
  createTrack: ({ title, file }: { title: string; file: File }) => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    return getInstance().post<{ data: TrackDetails<TrackDetailAttributes> }>(
      joinUrl(playlistsEndpoint, tracksEndpoint, 'upload'),
      formData,
    )
  },
  removeTrack: (trackId: string) => {
    return getInstance().delete<void>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId))
  },
  uploadTrackCover: ({ trackId, file }: { trackId: string; file: File }) => {
    const formData = new FormData()
    formData.append('cover', file)
    return getInstance().post<Cover>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, 'cover'), formData)
  },
  updateTrack: ({ trackId, payload }: { trackId: string; payload: UpdateTrackArgs }) => {
    return getInstance().put<{
      data: TrackDetails<TrackDetailAttributes>
    }>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId), payload)
  },
  addTrackToPlaylist: ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
    return getInstance().post<void>(joinUrl(playlistsEndpoint, playlistId, 'relationships', tracksEndpoint), {
      trackId,
    })
  },
  removeTrackFromPlaylist: ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
    return getInstance().delete<void>(joinUrl(playlistsEndpoint, playlistId, 'relationships', tracksEndpoint, trackId))
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
    return getInstance().put<void>(joinUrl(playlistsEndpoint, playlistId, tracksEndpoint, trackId, 'reorder'), {
      putAfterItemId,
    })
  },
  like: (trackId: string) => {
    return getInstance().post<ReactionResponse>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, 'like'), {})
  },
  dislike: (trackId: string) => {
    return getInstance().post<ReactionResponse>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, 'dislike'), {})
  },
}
