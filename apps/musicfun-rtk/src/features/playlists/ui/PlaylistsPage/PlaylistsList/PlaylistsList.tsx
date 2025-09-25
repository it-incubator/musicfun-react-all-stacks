import type { Playlist } from '@/features/playlists/api/playlistsApi.types'
import { PlaylistItem } from './PlaylistItem/PlaylistItem'
import s from './PlaylistsList.module.css'

type Props = {
  playlists: Playlist[]
}

export const PlaylistsList = ({ playlists }: Props) => {
  return (
    <div className={s.container}>
      {playlists.length ? (
        playlists.map((playlist: Playlist) => {
          return (
            <div key={playlist.id} className={'item'}>
              <PlaylistItem playlist={playlist} />
            </div>
          )
        })
      ) : (
        <h1>No playlists created</h1>
      )}
    </div>
  )
}
