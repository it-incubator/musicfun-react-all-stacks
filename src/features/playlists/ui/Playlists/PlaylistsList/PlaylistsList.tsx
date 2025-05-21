import { useForm } from "react-hook-form"
import { EditPlaylistForm } from "./EditPlaylistForm/EditPlaylistForm.tsx"
import { PlaylistItem } from "./PlaylistItem/PlaylistItem.tsx"
import type { Playlist, UpdatePlaylistArgs } from "../../../api/playlistsApi.types.ts"
import { useState } from "react"
import s from "./PlaylistsList.module.css"

type Props = {
  playlists: Playlist[]
}

export const PlaylistsList = ({ playlists }: Props) => {
  const [editId, setEditId] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const editPlaylist = (playlist: Playlist | null) => {
    setEditId(playlist?.id || null)

    if (playlist) {
      const { attributes } = playlist
      const { title, description, tags } = attributes
      reset({ title, description, tags })
    }
  }

  return (
    <div className={s.container}>
      {playlists.map((playlist) => {
        const isEditing = editId === playlist.id

        return (
          <div key={playlist.id} className={s.item}>
            {isEditing ? (
              <EditPlaylistForm
                editId={editId}
                setEditId={setEditId}
                editPlaylist={editPlaylist}
                handleSubmit={handleSubmit}
                register={register}
              />
            ) : (
              <PlaylistItem playlist={playlist} editPlaylist={editPlaylist} />
            )}
          </div>
        )
      })}
    </div>
  )
}
