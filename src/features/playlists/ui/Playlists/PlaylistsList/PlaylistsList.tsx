import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { PlaylistQueryKey, playlistsApi } from "../../../api/playlistsApi.ts"
import type { PlaylistItem, UpdatePlaylistArgs } from "../../../api/playlistsApi.types"
import s from "./PlaylistsList.module.css"

type Props = {
  playlists: PlaylistItem[]
}

export const PlaylistsList = ({ playlists }: Props) => {
  const [editId, setEditId] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const { mutate } = useMutation({
    mutationFn: playlistsApi.updatePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PlaylistQueryKey] })
      setEditId(null)
    },
  })

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if (!editId) return
    const { tags, description, title } = data
    mutate({ playlistId: editId, payload: { title, description, tags } })
  }

  const editPlaylist = (playlist: PlaylistItem | null) => {
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
        const { attributes } = playlist
        const isEditing = editId === playlist.id

        return (
          <div key={playlist.id} className={s.item}>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Редактировать плейлист</h2>
                <div>
                  <input {...register("title")} placeholder="Title" />
                </div>
                <div>
                  <input {...register("description")} placeholder={"Description"} />
                </div>
                <button>Сохранить</button>
                <button type={"button"} onClick={() => editPlaylist(null)}>
                  Отмена
                </button>
              </form>
            ) : (
              <>
                <div>
                  <b>title:</b> <span>{attributes.title}</span>
                </div>
                <div>
                  <b>description:</b> <span>{attributes.description}</span>
                </div>
                <div>
                  <b>tags:</b>{" "}
                  <span>{attributes.tags.length ? attributes.tags.map((t) => t) : "Теги не добавлены"}</span>
                </div>
                <div>
                  <b>added date:</b> <span>{new Date(attributes.addedAt).toLocaleDateString()}</span>
                </div>
                <button onClick={() => editPlaylist(playlist)}>Редактировать</button>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
