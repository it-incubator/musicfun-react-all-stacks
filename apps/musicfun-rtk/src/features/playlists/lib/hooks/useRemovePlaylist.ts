import { useRemovePlaylistMutation } from '@/features/playlists/api/playlistsApi'

export const useRemovePlaylist = () => {
  const [removePlaylistMutation] = useRemovePlaylistMutation()

  const removePlaylist = (playlistId: string) => {
    if (confirm('Вы уверены, что хотите удалить плейлист?')) {
      removePlaylistMutation(playlistId).unwrap()
    }
  }

  return { removePlaylist }
}
