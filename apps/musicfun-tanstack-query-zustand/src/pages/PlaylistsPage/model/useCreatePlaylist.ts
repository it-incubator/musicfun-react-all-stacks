import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client'
import { unwrap } from '@/shared/api/utils/unwrap'

export function useCreatePlaylist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { title: string; description: string | null }) => {
      const res = await unwrap(
        getClient().POST('/playlists', {
          body: payload,
        })
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlists', 'list'],
      })
    },
  })
}
