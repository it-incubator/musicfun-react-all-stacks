import { useMutation, useQueryClient } from '@tanstack/react-query'

import { playlistsKeys } from '@/features/playlists/api/query-key-factory.ts'
import { getClient } from '@/shared/api/client'
import { unwrap } from '@/shared/api/utils/unwrap'

export function useUploadPlaylistCover() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ playlistId, file }: { playlistId: string; file: File }) => {
      const res = await unwrap(
        getClient().POST('/playlists/{playlistId}/images/main', {
          params: { path: { playlistId } },
          body: {
            file: file as unknown as string,
          },
          bodySerializer: (body) => {
            const formData = new FormData()
            formData.append('file', body.file)
            return formData
          },
        })
      )
      return res.main
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: playlistsKeys.detail(variables.playlistId),
      })
      queryClient.invalidateQueries({
        queryKey: playlistsKeys.lists(),
      })
    },
  })
}
