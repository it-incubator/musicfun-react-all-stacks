import { showErrorToast } from "@/common/utils"
import { useCreatePlaylistMutation } from "../../../api/playlistsApi"
import type { CreatePlaylistArgs } from "../../../api/playlistsApi.types"
import { type SubmitHandler, useForm } from "react-hook-form"

export const AddPlaylistForm = () => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>()

  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = async (data) => {
    try {
      await createPlaylist(data).unwrap()
      reset()
    } catch (err) {
      showErrorToast("Ошибка при создании плейлиста", err)
    }
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
      <button>Создать плейлист</button>
    </form>
  )
}
