import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getClient } from '@/shared/api/client'
import { playlistsKeys } from './query-key-factory'
import type {
  SchemaCreatePlaylistRequestPayload,
  SchemaUpdatePlaylistRequestPayload,
} from '@/shared/api/schema'

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SchemaCreatePlaylistRequestPayload) =>
      getClient().POST('/playlists', { body: payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
    },
  })
}

export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      playlistId,
      payload,
    }: {
      playlistId: string
      payload: SchemaUpdatePlaylistRequestPayload
    }) =>
      getClient().PUT('/playlists/{playlistId}', {
        params: { path: { playlistId } },
        body: payload,
      }),
    onSuccess: (_, { playlistId }) => {
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.detail(playlistId) })
    },
  })
}

export const useUploadPlaylistCoverMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ playlistId, file }: { playlistId: string; file: File }) => {
      const formData = new FormData()
      formData.append('file', file)
      return getClient().POST('/playlists/{playlistId}/images/main', {
        params: { path: { playlistId } },
        body: formData as any,
        bodySerializer: (body) => body, // Don't serialize FormData as JSON
      })
    },
    onSuccess: (_, { playlistId }) => {
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.detail(playlistId) })
    },
  })
}

export const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (playlistId: string) =>
      getClient().DELETE('/playlists/{playlistId}', { params: { path: { playlistId } } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: playlistsKeys.all })
    },
  })
}
