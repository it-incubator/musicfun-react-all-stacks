import type {
  FetchPlaylistsTracksResponse,
  FetchTracksArgs,
  FetchTracksResponse,
  ReactionResponse,
  TrackDetailAttributes,
  TrackDetails,
  UpdateTrackArgs,
} from './tracksApi.types.ts'
import { joinUrl } from '../../common/utils/urlHelper'
import { playlistsEndpoint, tracksEndpoint } from '../../common/apiEntities/apiEntities.js'
import { Cover } from '../../common/types/playlists-tracks.types.js'
import { Nullable } from '../../common/types/common.types'
import { getApiClient, RequestOptions } from '../../v2/request'

export const tracksApi = {
  fetchTracks: ({ pageSize = 3, pageNumber, search = '' }: FetchTracksArgs, opts?: RequestOptions) => {
    return getApiClient().get<FetchTracksResponse>(joinUrl(playlistsEndpoint, tracksEndpoint), {
      ...opts,
      params: {
        pageSize,
        pageNumber,
        search,
      },
    })
  },

  fetchTracksInPlaylist: ({ playlistId }: { playlistId: string }) => {
    return getApiClient().get<FetchPlaylistsTracksResponse>(joinUrl(playlistsEndpoint, playlistId, tracksEndpoint))
  },

  fetchTrackById: (trackId: string) => {
    return getApiClient().get<{ data: TrackDetails<TrackDetailAttributes> }>(
      joinUrl(playlistsEndpoint, tracksEndpoint, trackId),
    )
  },

  createTrack: ({ title, file }: { title: string; file: File }) => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)
    return getApiClient().post<{ data: TrackDetails<TrackDetailAttributes> }>(
      joinUrl(playlistsEndpoint, tracksEndpoint, 'upload'),
      formData,
    )
  },

  removeTrack: (trackId: string) => {
    return getApiClient().delete<void>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId))
  },

  uploadTrackCover: ({ trackId, file }: { trackId: string; file: File }) => {
    const formData = new FormData()
    formData.append('cover', file)
    return getApiClient().post<Cover>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, 'cover'), formData)
  },

  updateTrack: ({ trackId, payload }: { trackId: string; payload: UpdateTrackArgs }) => {
    return getApiClient().put<{
      data: TrackDetails<TrackDetailAttributes>
    }>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId), payload)
  },

  addTrackToPlaylist: ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
    return getApiClient().post<void>(joinUrl(playlistsEndpoint, playlistId, 'relationships', tracksEndpoint), {
      trackId,
    })
  },

  removeTrackFromPlaylist: ({ playlistId, trackId }: { playlistId: string; trackId: string }) => {
    return getApiClient().delete<void>(joinUrl(playlistsEndpoint, playlistId, 'relationships', tracksEndpoint, trackId))
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
    return getApiClient().put<void>(joinUrl(playlistsEndpoint, playlistId, tracksEndpoint, trackId, 'reorder'), {
      putAfterItemId,
    })
  },

  like: (trackId: string) => {
    return getApiClient().post<ReactionResponse>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, 'like'), {})
  },

  dislike: (trackId: string) => {
    return getApiClient().post<ReactionResponse>(joinUrl(playlistsEndpoint, tracksEndpoint, trackId, 'dislike'), {})
  },
}
