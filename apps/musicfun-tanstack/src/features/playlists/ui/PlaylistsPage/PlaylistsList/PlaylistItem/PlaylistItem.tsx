import { type Nullable } from '@/common/types'
import { PlaylistReactions } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistReactions/PlaylistReactions.tsx'
import { PlaylistActions } from './PlaylistActions/PlaylistActions.tsx'
import type { Playlist } from '../../../../api/playlistsApi.types.ts'
import { PlaylistCover } from './PlaylistCover/PlaylistCover.tsx'
import { PlaylistDescription } from './PlaylistDescription/PlaylistDescription.tsx'

type Props = {
  playlist: Playlist
  editPlaylist: (playlist: Nullable<Playlist>) => void
  removePlaylist: (playlistId: string) => void
}

export const PlaylistItem = ({ playlist, editPlaylist, removePlaylist }: Props) => {
  return (
    <div>
      <PlaylistCover playlist={playlist} />
      <PlaylistDescription attributes={playlist.attributes} />
      <hr />
      <PlaylistActions playlist={playlist} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
      <PlaylistReactions id={playlist.id} currentUserReaction={playlist.attributes.currentUserReaction} />
    </div>
  )
}
