import type { Nullable } from "@/common/types/common.types"
import { PlaylistActions } from "./PlaylistActions/PlaylistActions"
import type { Playlist } from "../../../../api/playlistsApi.types"
import { PlaylistCover } from "./PlaylistCover/PlaylistCover"
import { PlaylistDescription } from "./PlaylistDescription/PlaylistDescription"
import { Path } from "@/common/routing"
import { Link, useLocation } from "react-router"
import { PlaylistReactions } from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistItem/PlaylistReactions/PlaylistReactions.tsx"
import { useGetMeQuery } from "@/features/auth/api/auth-api"

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
  const location = useLocation()

  const { data: userData } = useGetMeQuery()

  return (
    <div>
      <Link className={"link"} to={`${Path.Playlists}/${playlist.id}`} state={{ from: location.pathname }}>
        <PlaylistCover playlist={playlist} editable={editable} />
      </Link>
      <PlaylistDescription attributes={playlist.attributes} />
      {withActions && (
        <PlaylistActions playlist={playlist} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
      )}
      {userData && <PlaylistReactions id={playlist.id} currentUserReaction={playlist.attributes.currentUserReaction} />}
    </div>
  )
}
