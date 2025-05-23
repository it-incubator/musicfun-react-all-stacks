import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router"
import { Layout, PageTitle, Path } from "@/common"
import { PlaylistQueryKey, playlistsApi } from "../../api/playlistsApi.ts"
import { PlaylistCover } from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistCover/PlaylistCover.tsx"
import { PlaylistDescription } from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx"

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
    </Layout>
  )
}
