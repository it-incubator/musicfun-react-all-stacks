import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router"
import { PageTitle, Path } from "@/common"
import { PlaylistQueryKey, playlistsApi } from "../../api/playlistsApi.ts"
import { PlaylistCover } from "../Playlists/PlaylistsList/PlaylistItem/PlaylistCover/PlaylistCover.tsx"
import { PlaylistDescription } from "../Playlists/PlaylistsList/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx"

export const PlaylistPage = () => {
  const { id } = useParams<string>()

  const { data } = useQuery({
    queryKey: [PlaylistQueryKey],
    queryFn: () => playlistsApi.fetchPlaylistById(id ?? ""),
  })

  if (!data) {
    return <h1>Loading...</h1>
  }

  return (
    <div className={"layout"}>
      <PageTitle>Информация о плейлисте</PageTitle>
      <Link to={Path.Playlists}>Вернуться назад</Link>
      <div>
        <PlaylistCover playlist={data?.data.data} />
        <PlaylistDescription attributes={data?.data.data.attributes} />
      </div>
    </div>
  )
}
