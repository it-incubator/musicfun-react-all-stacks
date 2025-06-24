import type { Nullable } from "@/common/types/common.types"
import { PlaylistActions } from "./PlaylistActions/PlaylistActions"
import type { Playlist } from "../../../../api/playlistsApi.types"
import { PlaylistCover } from "./PlaylistCover/PlaylistCover"
import { PlaylistDescription } from "./PlaylistDescription/PlaylistDescription"
import { Path } from "@/common/routing"
import { Link } from "react-router"

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
  return (
    <div>
      <Link className={"link"} to={`${Path.Playlists}/${playlist.id}`} state={{ from: location.pathname }}>
        <PlaylistCover playlist={playlist} editable={editable} />
      </Link>
      <PlaylistDescription attributes={playlist.attributes} />
      {withActions && (
        <PlaylistActions playlist={playlist} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
      )}
    </div>
  )
}
