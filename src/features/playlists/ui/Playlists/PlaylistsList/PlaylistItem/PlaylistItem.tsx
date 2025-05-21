import type { Nullable } from "@/common"
import type { Playlist } from "../../../../api/playlistsApi.types.ts"

type Props = {
  playlist: Playlist
  editPlaylist: (playlist: Nullable<Playlist>) => void
  removePlaylist: (playlistId: string) => void
}

export const PlaylistItem = ({ playlist, editPlaylist, removePlaylist }: Props) => {
  const { title, description, tags, addedAt } = playlist.attributes

  return (
    <div>
      <div>
        <b>title:</b> <span>{title}</span>
      </div>
      <div>
        <b>description:</b> <span>{description}</span>
      </div>
      <div>
        <b>tags:</b> <span>{tags.length ? tags.map((t) => t) : "Теги не добавлены"}</span>
      </div>
      <div>
        <b>added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
      </div>
      <button onClick={() => editPlaylist(playlist)}>Редактировать</button>
      <button onClick={() => removePlaylist(playlist.id)}>Удалить</button>
    </div>
  )
}
