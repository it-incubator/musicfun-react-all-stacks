import { useRemovePlaylistMutation } from '@/features/playlists/api/playlistsApi'
import { isFetchBaseQueryError, isErrorWithMessage, showErrorToast } from '@/common/utils'

export const useRemovePlaylist = () => {
  const [removePlaylistMutation] = useRemovePlaylistMutation()

  const removePlaylist = (playlistId: string) => {
    if (confirm('Вы уверены, что хотите удалить плейлист?')) {
      removePlaylistMutation(playlistId)
        .unwrap()
        .catch((err: unknown) => {
          if (isFetchBaseQueryError(err)) {
            const errMsg = 'error' in err ? err.error : JSON.stringify(err.data)
            showErrorToast(errMsg)
          } else if (isErrorWithMessage(err)) {
            showErrorToast(err.message)
          }
        })
    }
  }

  return { removePlaylist }
}
