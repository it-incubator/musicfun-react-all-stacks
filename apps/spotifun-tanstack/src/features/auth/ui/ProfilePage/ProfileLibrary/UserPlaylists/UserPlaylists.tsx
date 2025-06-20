import { playlistsKey } from "@/common/apiEntities"
import { playlistsApi } from "@/features/playlists/api/playlistsApi.ts"
import { AddPlaylistForm } from "@/features/playlists/ui/PlaylistsPage/AddPlaylistForm/AddPlaylistForm.tsx"
import { PlaylistsList } from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx"
import { useQuery } from "@tanstack/react-query"

export const UserPlaylists = () => {
  const { data } = useQuery({
    queryKey: [playlistsKey],
    queryFn: () => playlistsApi.fetchMyPlaylists(),
  })

  const playlists = (data?.data.data || []).slice().sort((a, b) => a.attributes.order - b.attributes.order)

  return (
    <>
      <AddPlaylistForm />
      <PlaylistsList playlists={playlists} />
    </>
  )
}
