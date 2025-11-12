import { useRemovePlaylistMutation } from '@/features/playlists/api/playlistsApi'

export const useRemovePlaylist = () => {
  const [removePlaylistMutation] = useRemovePlaylistMutation()

  const removePlaylist = (playlistId: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      removePlaylistMutation(playlistId).unwrap()
    }
  }

  return { removePlaylist }
}
