import type { Nullable } from "@/common"
import { PlaylistDescription } from "./PlaylistDescription/PlaylistDescription.tsx"
import { PlaylistCover } from "./PlaylistCover/PlaylistCover.tsx"
import type { Playlist } from "../../../../api/playlistsApi.types.ts"

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
      <button onClick={() => editPlaylist(playlist)}>Редактировать</button>
      <button onClick={() => removePlaylist(playlist.id)}>Удалить</button>
    </>
  )
}
