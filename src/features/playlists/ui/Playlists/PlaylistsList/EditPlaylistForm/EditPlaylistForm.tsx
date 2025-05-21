import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from "react-hook-form"
import { PlaylistQueryKey, playlistsApi } from "../../../../api/playlistsApi.ts"
import type { Playlist, UpdatePlaylistArgs } from "../../../../api/playlistsApi.types.ts"

type Props = {
  editId: string | null
  setEditId: (editId: string | null) => void
  editPlaylist: (playlist: Playlist | null) => void
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
}

export const EditPlaylistForm = ({ editId, setEditId, editPlaylist, handleSubmit, register }: Props) => {
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

  return (
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
  )
}
