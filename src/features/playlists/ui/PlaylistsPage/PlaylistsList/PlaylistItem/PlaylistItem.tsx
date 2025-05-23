import { type Nullable } from "@/common"
import { PlaylistActions } from "./PlaylistActions/PlaylistActions.tsx"
import type { Playlist } from "../../../../api/playlistsApi.types.ts"
import { PlaylistCover } from "./PlaylistCover/PlaylistCover.tsx"
import { PlaylistDescription } from "./PlaylistDescription/PlaylistDescription.tsx"

type Props = {
  playlist: Playlist
  editPlaylist: (playlist: Nullable<Playlist>) => void
  removePlaylist: (playlistId: string) => void
}

export const PlaylistItem = ({ playlist, editPlaylist, removePlaylist }: Props) => {
  return (
    <>
      <PlaylistCover playlist={playlist} />
      <PlaylistDescription attributes={playlist.attributes} />
      <hr />
      <PlaylistActions playlist={playlist} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
    </>
  )
}
