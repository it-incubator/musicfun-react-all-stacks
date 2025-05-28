import { Link, Navigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Layout, Loader, PageTitle } from "@/common/components"
import { Path } from "@/common/routing"
import { PlaylistTracks } from "./PlaylistTracks/PlaylistTracks.tsx"
import { PlaylistQueryKey, playlistsApi } from "../../api/playlistsApi.ts"
import { PlaylistCover } from "../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistCover/PlaylistCover.tsx"
import { PlaylistDescription } from "../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx"

export const PlaylistPage = () => {
  const { playlistId } = useParams<{ playlistId: string }>()

  if (!playlistId) {
    return <Navigate to={Path.NotFound} />
  }

  const { data, isPending } = useQuery({
    queryKey: [PlaylistQueryKey, playlistId],
    queryFn: () => playlistsApi.fetchPlaylistById(playlistId),
  })

  if (isPending) return <Loader />

  if (!data) return <h1>Плейлист не найден</h1>

  return (
    <Layout>
      <Link className={"link"} to={Path.Playlists}>
        Вернуться назад
      </Link>
      <PageTitle>Информация о плейлисте</PageTitle>
      <div>
        <PlaylistCover playlist={data?.data.data} />
        <PlaylistDescription attributes={data?.data.data.attributes} />
      </div>
      <PlaylistTracks />
    </Layout>
  )
}
