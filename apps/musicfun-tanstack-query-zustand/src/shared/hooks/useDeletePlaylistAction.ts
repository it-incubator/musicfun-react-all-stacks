import { toast } from 'react-toastify'

import { useDeletePlaylist } from '@/pages/PlaylistsPage/model/useDeletePlaylist'

/*for delete Playlist into Playlist modal and PlaylistCard*/
export const useDeletePlaylistAction = (playlistId: string) => {
  const { mutate } = useDeletePlaylist()

  return () => {
    if (confirm('Do you want to delete the playlist?')) {
      mutate(playlistId, {
        onSuccess: () => {
          toast('Playlist has been deleted', { type: 'success', theme: 'colored' })
        },
        onError: () => {
          toast('Failed to delete playlist', { type: 'error', theme: 'colored' })
        },
      })
    }
  }
}
