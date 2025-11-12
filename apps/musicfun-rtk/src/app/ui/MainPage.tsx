import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import { PlaylistsList } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx'
import { useFetchTracksQuery } from '@/features/tracks/api/tracksApi.ts'
import { TrackItem } from '@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackItem.tsx'
import s from './MainPage.module.css'

export const MainPage = () => {
  const defaultParams = { search: '', pageSize: 10, pageNumber: 1 }

  const { data: playlists } = useFetchPlaylistsQuery(defaultParams)
  const { data: tracks } = useFetchTracksQuery(defaultParams)

  return (
    <div>
      <h1>Main Page</h1>
      <div>
        <h2>New playlists</h2>
        {playlists && <PlaylistsList playlists={playlists.data} />}
      </div>
      <div className={s.container}>
        <h2>New tracks</h2>
        {tracks && tracks.data.map((track) => <TrackItem track={track} key={track.id} />)}
      </div>
    </div>
  )
}
