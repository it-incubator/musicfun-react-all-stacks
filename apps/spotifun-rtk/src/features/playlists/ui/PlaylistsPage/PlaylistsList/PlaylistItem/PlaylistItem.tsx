import type { Nullable } from "@/common/types/common.types"
import { PlaylistActions } from "./PlaylistActions/PlaylistActions"
import type { Playlist } from "../../../../api/playlistsApi.types"
import { PlaylistCover } from "./PlaylistCover/PlaylistCover"
import { PlaylistDescription } from "./PlaylistDescription/PlaylistDescription"

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
    </div>
  )
}
