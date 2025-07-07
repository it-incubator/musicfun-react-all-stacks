import { useRemovePlaylistMutation } from '@/features/playlists/api/playlistsApi'
import { showErrorToast } from '@/common/utils'

export const useRemovePlaylist = () => {
  const [removePlaylistMutation] = useRemovePlaylistMutation()

  const removePlaylist = (playlistId: string) => {
    if (confirm('Вы уверены, что хотите удалить плейлист?')) {
      removePlaylistMutation(playlistId)
        .unwrap()
        .catch((err: unknown) => showErrorToast('Не удалось удалить плейлист', err))
    }
  }

  return { removePlaylist }
}
