import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client'
import { unwrap } from '@/shared/api/utils/unwrap'

export const useCreateTrack = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ title, file }: { title: string; file: File }) => {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('file', file)

      const res = await unwrap(
        getClient().POST('/playlists/tracks/upload', {
          // FIXME: temporary typescript fix
          body: formData as unknown as { title: string; file: string },
        })
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracks', 'list'],
      })
    },
  })
}
