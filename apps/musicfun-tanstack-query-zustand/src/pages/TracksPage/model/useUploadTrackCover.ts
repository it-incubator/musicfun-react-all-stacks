import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client'
import { unwrap } from '@/shared/api/utils/unwrap'

export const useUploadTrackCover = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ trackId, cover }: { trackId: string; cover: File }) => {
      const formData = new FormData()
      formData.append('cover', cover)

      const res = await unwrap(
        getClient().POST('/playlists/tracks/{trackId}/cover', {
          params: { path: { trackId } },
          // FIXME: temporary typescript fix
          body: formData as unknown as { cover: string },
        })
      )
      return res.main
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tracks', 'detail', variables.trackId],
      })
      queryClient.invalidateQueries({
        queryKey: ['tracks', 'list'],
      })
    },
  })
}
