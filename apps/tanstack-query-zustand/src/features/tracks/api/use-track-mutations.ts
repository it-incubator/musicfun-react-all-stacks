import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tracksApi } from './tracksApi'
import { tracksKeys } from './query-key-factory'
import { playlistsKeys } from '@/features/playlists/api/query-key-factory'
import { getClient } from '@/shared/api/client'
import type { SchemaUpdateTrackRequestPayload } from '@/shared/api/schema'

export const useAddTrackToPlaylistMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
      tracksApi.addTrackToPlaylist(playlistId, trackId),
    onSuccess: (_, { trackId, playlistId }) => {
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
      void queryClient.invalidateQueries({ queryKey: tracksKeys.detail(trackId) })
    },
  })
}

export const useRemoveTrackFromPlaylistMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
      tracksApi.unbindTrackFromPlaylist(playlistId, trackId),
    onSuccess: (_, { trackId, playlistId }) => {
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
      void queryClient.invalidateQueries({ queryKey: tracksKeys.detail(trackId) })
    },
  })
}

export const useRemoveTrackMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (trackId: string) => tracksApi.removeTrack(trackId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.all })
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
    },
  })
}

export const usePublishTrackMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (trackId: string) =>
      getClient().POST('/playlists/tracks/{trackId}/actions/publish', {
        params: { path: { trackId } },
      }),
    onSuccess: (_, trackId) => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.all })
      void queryClient.invalidateQueries({ queryKey: tracksKeys.detail(trackId) })
    },
  })
}

export const useUpdateTrackMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      trackId,
      payload,
    }: {
      trackId: string
      payload: SchemaUpdateTrackRequestPayload
    }) =>
      getClient().PUT('/playlists/tracks/{trackId}', {
        params: { path: { trackId } },
        body: payload,
      }),
    onSuccess: (_, { trackId }) => {
      void queryClient.invalidateQueries({ queryKey: tracksKeys.all })
      void queryClient.invalidateQueries({ queryKey: tracksKeys.detail(trackId) })
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
    },
  })
}
