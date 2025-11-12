import { playlistsKey } from '@/common/apiEntities'
import { playlistsApi } from '@/features/playlists/api/playlistsApi.ts'
import { AddPlaylistForm } from '@/features/playlists/ui/PlaylistsPage/AddPlaylistForm/AddPlaylistForm.tsx'
import { PlaylistsWithDnd } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsListWithDnd.tsx'
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
