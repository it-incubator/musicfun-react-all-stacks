import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { queryClient } from "@/main.tsx"
import { PlaylistQueryKey, playlistsApi } from "../../../api/playlistsApi.ts"
import type { CreatePlaylistArgs } from "../../../api/playlistsApi.types.ts"

export const AddPlaylistForm = () => {
  const { register, handleSubmit } = useForm<CreatePlaylistArgs>()

  const { mutate } = useMutation({
    mutationFn: playlistsApi.createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PlaylistQueryKey] })
    },
  })

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Добавить новый плейлист</h2>
      <div>
        <input {...register("title")} placeholder="Title" />
      </div>
      <div>
        <input {...register("description")} placeholder={"Description"} />
      </div>
      <button>add new playlist</button>
    </form>
  )
}
