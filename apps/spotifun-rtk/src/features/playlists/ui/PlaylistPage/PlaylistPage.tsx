import { Loader, PageTitle } from "@/common/components"
import { Path } from "@/common/routing"
import { useFetchPlaylistByIdQuery } from "../../api/playlistsApi"
import { Link, Navigate, useParams } from "react-router"
import { PlaylistCover } from "../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistCover/PlaylistCover"
import { PlaylistDescription } from "../PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistDescription/PlaylistDescription"
import { PlaylistTracks } from "./PlaylistTracks/PlaylistTracks"

export const PlaylistPage = () => {
  const { playlistId } = useParams<{ playlistId?: string }>()

  const { data, isLoading } = useFetchPlaylistByIdQuery(playlistId as string, {
    skip: !playlistId,
  })

  if (!playlistId) return <Navigate to={Path.NotFound} />

  if (isLoading) return <Loader />

  if (!data) return <h1>Плейлист не найден</h1>

  return (
    <>
      <Link className={"link"} to={Path.Playlists}>
        Вернуться назад
      </Link>
      <PageTitle>Информация о плейлисте</PageTitle>
      <div>
        <PlaylistCover playlist={data.data} />
        <PlaylistDescription attributes={data.data.attributes} />
      </div>
      <PlaylistTracks />
    </>
  )
}
