import { playlistsKey } from "@/common/apiEntities"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { showErrorToast } from "@/common/utils"
import type { Nullable } from "@/common/types/common.types.ts"
import { queryClient } from "@/main.tsx"
import { playlistsApi } from "../../../api/playlistsApi.ts"
import type { Playlist, UpdatePlaylistArgs } from "../../../api/playlistsApi.types.ts"
import { EditPlaylistForm } from "./EditPlaylistForm/EditPlaylistForm.tsx"
import { PlaylistItem } from "./PlaylistItem/PlaylistItem.tsx"
import s from "./PlaylistsList.module.css"

type Props = {
  playlists: Playlist[]
}

export const PlaylistsList = ({ playlists }: Props) => {
  const [editId, setEditId] = useState<Nullable<string>>(null)

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const { mutate: removePlaylistMutation } = useMutation({
    mutationFn: playlistsApi.removePlaylist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [playlistsKey] }),
    onError: (err: unknown) => showErrorToast("Не удалось удалить плейлист", err),
  })

  const { mutate: updatePlaylistMutation } = useMutation({
    mutationFn: playlistsApi.updatePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [playlistsKey] })
      setEditId(null)
    },
    onError: (error: unknown) => {
      showErrorToast("Ошибка при обновлении плейлиста", error)
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
      {playlists.length ? (
        playlists.map((playlist) => {
          const isEditing = editId === playlist.id

          return (
            <div key={playlist.id} className={"item"}>
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
        })
      ) : (
        <h1>Плейлисты не созданы</h1>
      )}
    </div>
  )
}
