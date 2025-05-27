import { Layout, PageTitle, Path } from "@/common"
import { PlaylistTracks } from "@/features/playlists/ui/PlaylistPage/PlaylistTracks/PlaylistTracks.tsx"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router"
import { PlaylistQueryKey, playlistsApi } from "../../api/playlistsApi.ts"
import { PlaylistCover } from "../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistCover/PlaylistCover.tsx"
import { PlaylistDescription } from "../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx"

export const PlaylistPage = () => {
  const { id } = useParams<string>()

  const { data } = useQuery({
    queryKey: [PlaylistQueryKey],
    queryFn: () => playlistsApi.fetchPlaylistById(id ?? ""),
    enabled: !!id,
  })

  if (!data) {
    return <span>Loading...</span>
  }

  return (
    <Layout>
      <Link to={Path.Playlists}>Вернуться назад</Link>
      <PageTitle>Информация о плейлисте</PageTitle>
      <div>
        <PlaylistCover playlist={data?.data.data} />
        <PlaylistDescription attributes={data?.data.data.attributes} />
      </div>
      <PlaylistTracks />
    </Layout>
  )
}
