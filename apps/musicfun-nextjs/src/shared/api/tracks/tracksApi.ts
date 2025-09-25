import type {
  FetchPlaylistsTracksResponse,
  FetchTracksArgs,
  FetchTracksResponse,
  ReactionResponse,
  TrackDetailAttributes,
  TrackDetails,
  UpdateTrackArgs,
} from './tracksApi.types.ts'
import { baseUrl, formHeaders, jsonHeaders } from '@/shared/api/base'
import { Nullable } from '@/shared/common.types'

export const tracksApi = {
  async fetchTracks({ pageSize = 3, pageNumber, search = '' }: FetchTracksArgs) {
    const url = new URL(`${baseUrl}/playlists/tracks`)
    url.searchParams.set('pageSize', pageSize.toString())
    url.searchParams.set('pageNumber', pageNumber.toString())
    url.searchParams.set('search', search)

    const res = await fetch(url.toString(), { headers: jsonHeaders })
    return res.json() as Promise<FetchTracksResponse>
  },

  async fetchTracksInPlaylist({ playlistId }: { playlistId: string }) {
    const url = `${baseUrl}/playlists/${playlistId}/tracks`
    const res = await fetch(url, { headers: jsonHeaders })
    return res.json() as Promise<FetchPlaylistsTracksResponse>
  },

  async fetchTrackById(trackId: string) {
    const url = `${baseUrl}/playlists/tracks/${trackId}`
    const res = await fetch(url, { headers: jsonHeaders })
    return res.json() as Promise<{ data: TrackDetails<TrackDetailAttributes> }>
  },

  async createTrack({ title, file }: { title: string; file: File }) {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    const url = `${baseUrl}/playlists/tracks/upload`
    const res = await fetch(url, {
      method: 'POST',
      headers: formHeaders,
      body: formData,
    })
    return res.json() as Promise<{ data: TrackDetails<TrackDetailAttributes> }>
  },

  async removeTrack(trackId: string) {
    const url = `${baseUrl}/playlists/tracks/${trackId}`
    await fetch(url, { method: 'DELETE', headers: jsonHeaders })
  },

  // async uploadTrackCover({ trackId, file }: { trackId: string; file: File }) {
  //   const formData = new FormData()
  //   formData.append('cover', file)
  //
  //   const url = `${baseUrl}/playlists/tracks/${trackId}/cover`
  //   const res = await fetch(url, {
  //     method: 'POST',
  //     headers: formHeaders,
  //     body: formData,
  //   })
  //   return res.json() as Promise<Cover>
  // },

  async updateTrack({ trackId, payload }: { trackId: string; payload: UpdateTrackArgs }) {
    const url = `${baseUrl}/playlists/tracks/${trackId}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    })
    return res.json() as Promise<{ data: TrackDetails<TrackDetailAttributes> }>
  },

  async addTrackToPlaylist({ playlistId, trackId }: { playlistId: string; trackId: string }) {
    const url = `${baseUrl}/playlists/${playlistId}/relationships/tracks`
    await fetch(url, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ trackId }),
    })
  },

  async removeTrackFromPlaylist({ playlistId, trackId }: { playlistId: string; trackId: string }) {
    const url = `${baseUrl}/playlists/${playlistId}/relationships/tracks/${trackId}`
    await fetch(url, { method: 'DELETE', headers: jsonHeaders })
  },

  async reorderTracks({
    trackId,
    playlistId,
    putAfterItemId,
  }: {
    trackId: string
    playlistId: string
    putAfterItemId: Nullable<string>
  }) {
    const url = `${baseUrl}/playlists/${playlistId}/tracks/${trackId}/reorder`
    await fetch(url, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify({ putAfterItemId }),
    })
  },

  async like(trackId: string) {
    const url = `${baseUrl}/playlists/tracks/${trackId}/like`
    const res = await fetch(url, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({}),
    })
    return res.json() as Promise<ReactionResponse>
  },

  async dislike(trackId: string) {
    const url = `${baseUrl}/playlists/tracks/${trackId}/dislike`
    const res = await fetch(url, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({}),
    })
    return res.json() as Promise<ReactionResponse>
  },
}
