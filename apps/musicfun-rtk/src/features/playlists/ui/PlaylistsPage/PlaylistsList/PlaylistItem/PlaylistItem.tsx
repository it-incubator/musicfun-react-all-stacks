import type { Nullable } from '@/common/types/common.types'
import type { Playlist } from '../../../../api/playlistsApi.types'
import { useGetMeQuery } from '@/features/auth/api/auth-api'
import { PlaylistReactions } from '@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistReactions/PlaylistReactions.tsx'
import { PlaylistActions } from './PlaylistActions/PlaylistActions'
import { PlaylistCover } from './PlaylistCover/PlaylistCover'
import { PlaylistDescription } from './PlaylistDescription/PlaylistDescription'

type Props = {
  playlist: Playlist
  editPlaylist?: (playlist: Nullable<Playlist>) => void
  removePlaylist?: (playlistId: string) => void
  withActions?: boolean
  editable?: boolean
}

export const PlaylistItem = ({
  playlist,
  editPlaylist,
  removePlaylist,
  withActions = false,
  editable = false,
}: Props) => {
  const { data: userData } = useGetMeQuery()

  return (
    <div>
      <PlaylistCover playlist={playlist} editable={editable} />
      <PlaylistDescription attributes={playlist.attributes} />
      {withActions && (
        <PlaylistActions playlist={playlist} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
      )}
      {userData && <PlaylistReactions id={playlist.id} currentUserReaction={playlist.attributes.currentUserReaction} />}
    </div>
  )
}
