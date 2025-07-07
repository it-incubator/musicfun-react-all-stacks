import { AddPlaylistForm } from '@/features/playlists/ui/PlaylistsPage/AddPlaylistForm/AddPlaylistForm.tsx'
import { PlaylistsWithDnd } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsListWithDnd.tsx'
import { useFetchMyPlaylistsQuery } from '@/features/playlists/api/playlistsApi'

export const UserPlaylists = () => {
  const { data } = useFetchMyPlaylistsQuery()

  const playlists = (data?.data || []).slice().sort((a, b) => a.attributes.order - b.attributes.order)

  return (
    <>
      <AddPlaylistForm />
      <PlaylistsWithDnd playlists={playlists} />
    </>
  )
}
