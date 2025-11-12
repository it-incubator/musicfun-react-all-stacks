import { playlistsKey } from '@/common/apiEntities'
import { showErrorToast } from '@/common/utils'
import { playlistsApi } from '../../api/playlistsApi.ts'
import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'

export const useRemovePlaylist = () => {
  const { mutate } = useMutation({
    mutationFn: playlistsApi.removePlaylist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [playlistsKey] }),
    onError: (err: unknown) => showErrorToast('Не удалось удалить плейлист', err),
  })

  const removePlaylist = (playlistId: string) => {
    if (confirm('Вы уверены, что хотите удалить плейлист?')) {
      mutate(playlistId)
    }
  }

  return { removePlaylist }
}
