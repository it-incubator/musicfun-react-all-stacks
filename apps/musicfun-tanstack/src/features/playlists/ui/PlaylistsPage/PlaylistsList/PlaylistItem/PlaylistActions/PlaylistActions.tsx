import { Path } from '@/common/routing'
import type { Nullable } from '@/common/types'
import { Link } from 'react-router'
import type { Playlist } from '../../../../../api/playlistsApi.types.ts'

import s from './PlaylistActions.module.css'

type Props = {
  playlist: Playlist
  editPlaylist: (playlist: Nullable<Playlist>) => void
  removePlaylist: (playlistId: string) => void
}

export const PlaylistActions = ({ removePlaylist, playlist, editPlaylist }: Props) => {
  return (
    <div className={s.actions}>
      <button onClick={() => editPlaylist(playlist)}>Редактировать</button>
      <button onClick={() => removePlaylist(playlist.id)}>Удалить</button>
      <Link className={'link'} to={`${Path.Playlists}/${playlist.id}`}>
        Перейти в плейлист
      </Link>
    </div>
  )
}
