import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client'
import { unwrap } from '@/shared/api/utils/unwrap'

export function useDeletePlaylist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (playlistId: string) => {
      await unwrap(
        getClient().DELETE('/playlists/{playlistId}', { params: { path: { playlistId } } })
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlists', 'list'],
      })
    },
  })
}
