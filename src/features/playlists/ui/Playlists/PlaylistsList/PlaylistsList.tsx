import type { Nullable } from "@/common"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/main.tsx"
import { toast } from "react-toastify"
import { PlaylistQueryKey, playlistsApi } from "../../../api/playlistsApi.ts"
import { EditPlaylistForm } from "./EditPlaylistForm/EditPlaylistForm.tsx"
import { PlaylistItem } from "./PlaylistItem/PlaylistItem.tsx"
import type { Playlist, UpdatePlaylistArgs } from "../../../api/playlistsApi.types.ts"
import s from "./PlaylistsList.module.css"

type Props = {
  playlists: Playlist[]
}

export const PlaylistsList = ({ playlists }: Props) => {
  const [editId, setEditId] = useState<Nullable<string>>(null)

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const { mutate: removePlaylistMutation } = useMutation({
    mutationFn: playlistsApi.removePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PlaylistQueryKey] })
    },
    onError: (error: unknown) => {
      toast("Не удалось удалить плейлист", { theme: "colored", type: "error" })
      console.error("Ошибка при удалении:", error)
    },
  })

  const { mutate: updatePlaylistMutation } = useMutation({
    mutationFn: playlistsApi.updatePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PlaylistQueryKey] })
      setEditId(null)
    },
    onError: (error: unknown) => {
      toast("Ошибка при обновлении плейлиста", { theme: "colored", type: "error" })
      console.error("Ошибка при обновлении:", error)
    },
  })

  const editPlaylist = (playlist: Nullable<Playlist>) => {
    setEditId(playlist?.id || null)

    if (playlist) {
      const { attributes } = playlist
      const { title, description, tags } = attributes
      reset({ title, description, tags })
    }
  }

  const removePlaylist = (playlistId: string) => {
    if (confirm("Вы уверены, что хотите удалить плейлист?")) {
      removePlaylistMutation(playlistId)
    }
  }

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if (!editId) return
    const { tags, description, title } = data
    updatePlaylistMutation({ playlistId: editId, payload: { title, description, tags } })
  }

  return (
    <div className={s.container}>
      {playlists.map((playlist) => {
        const isEditing = editId === playlist.id

        return (
          <div key={playlist.id} className={s.item}>
            {isEditing ? (
              <EditPlaylistForm
                onSubmit={onSubmit}
                editPlaylist={editPlaylist}
                handleSubmit={handleSubmit}
                register={register}
              />
            ) : (
              <PlaylistItem playlist={playlist} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
            )}
          </div>
        )
      })}
    </div>
  )
}
