import type { Nullable } from '@/common/types/common.types'
import type { Playlist } from '../../../../../api/playlistsApi.types'

import s from './PlaylistActions.module.css'

type Props = {
  playlist: Playlist
  editPlaylist?: (playlist: Nullable<Playlist>) => void
  removePlaylist?: (playlistId: string) => void
}

export const PlaylistActions = ({ removePlaylist, playlist, editPlaylist }: Props) => {
  return (
    <div className={s.actions}>
      {editPlaylist && <button onClick={() => editPlaylist(playlist)}>Edit</button>}
      {removePlaylist && <button onClick={() => removePlaylist(playlist.id)}>Delete</button>}
    </div>
  )
}
