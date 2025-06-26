import { useFetchTracksQuery } from "@/features/tracks/api/tracksApi.ts"
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi.ts"
import { TrackItem } from "@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackItem.tsx"
import { PlaylistsList } from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx"
import s from './MainPage.module.css'

export const MainPage = () => {
  const { data: playlists } = useFetchPlaylistsQuery({ search: "", pageNumber: 1, pageSize: 10 })
  const { data: tracks } = useFetchTracksQuery({ search: "", pageNumber: 1, pageSize: 10 })
  return (
    <div>
      <h1>Главная страница</h1>
      <div>Good afternoon</div>
      <div>Your top mixes</div>
      <div>Made for you</div>
      <div>
        <h2>New playlists</h2>
        {playlists && <PlaylistsList playlists={playlists.data} />}
      </div>
      <div className={s.container}>
        <h2>New tracks</h2>
        {tracks && tracks.data.map((track, i) => <TrackItem track={track} key={i} />)}
      </div>
    </div>
  )
}
