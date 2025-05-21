import type { PlaylistItem as PlaylistItemType } from "../../../../api/playlistsApi.types.ts"

type Props = {
  playlist: PlaylistItemType
  editPlaylist: (playlist: PlaylistItemType | null) => void
}

export const PlaylistItem = ({ playlist, editPlaylist }: Props) => {
  const { attributes } = playlist

  return (
    <div>
      <div>
        <b>title:</b> <span>{attributes.title}</span>
      </div>
      <div>
        <b>description:</b> <span>{attributes.description}</span>
      </div>
      <div>
        <b>tags:</b> <span>{attributes.tags.length ? attributes.tags.map((t) => t) : "Теги не добавлены"}</span>
      </div>
      <div>
        <b>added date:</b> <span>{new Date(attributes.addedAt).toLocaleDateString()}</span>
      </div>
      <button onClick={() => editPlaylist(playlist)}>Редактировать</button>
    </div>
  )
}
