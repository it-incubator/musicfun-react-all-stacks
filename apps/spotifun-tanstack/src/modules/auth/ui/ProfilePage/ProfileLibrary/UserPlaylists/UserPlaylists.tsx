import { playlistsKey } from '@/common/apiEntities'
import { playlistsApi } from '@/modules/musicstaff/playlists/api/playlistsApi.ts'
import { AddPlaylistForm } from '@/modules/musicstaff/playlists/ui/PlaylistsPage/AddPlaylistForm/AddPlaylistForm.tsx'
import { PlaylistsWithDnd } from '@/modules/musicstaff/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsListWithDnd.tsx'
import { useQuery } from '@tanstack/react-query'

export const UserPlaylists = () => {
  const { data } = useQuery({
    queryKey: [playlistsKey],
    queryFn: () => playlistsApi.fetchMyPlaylists(),
  })

  const playlists = (data?.data.data || []).slice().sort((a, b) => a.attributes.order - b.attributes.order)

  return (
    <>
      <AddPlaylistForm />
      <PlaylistsWithDnd playlists={playlists} />
    </>
  )
}
