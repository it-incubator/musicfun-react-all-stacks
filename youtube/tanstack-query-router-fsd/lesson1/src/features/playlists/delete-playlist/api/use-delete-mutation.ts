import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SchemaGetPlaylistsOutput } from '../../../../shared/api/schema.ts'
import { client } from '../../../../shared/api/client.ts'
import { playlistsKeys } from '../../../../shared/api/keys-factories/playlists-keys-factory.ts'

export const useDeleteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (playlistId: string) => {
      const response = await client.DELETE('/playlists/{playlistId}', {
        params: { path: { playlistId } },
      })
      return response.data
    },
    onSuccess: (_, playlistId) => {
      queryClient.setQueriesData({ queryKey: playlistsKeys.lists() }, (oldData: SchemaGetPlaylistsOutput) => {
        return {
          ...oldData,
          data: oldData.data.filter((p) => p.id !== playlistId),
        }
      })
      queryClient.removeQueries({ queryKey: playlistsKeys.detail(playlistId) })
    },
  })
}
