import { type FieldErrors, type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from "react-hook-form"
import type { Nullable } from "@/common/types/common.types"
import type { Playlist, UpdatePlaylistArgs } from "../../../../api/playlistsApi.types"

type Props = {
  editPlaylist: (playlist: Nullable<Playlist>) => void
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
  onSubmit: SubmitHandler<UpdatePlaylistArgs>
  errors?: FieldErrors<UpdatePlaylistArgs>
}

export const EditPlaylistForm = ({ onSubmit, editPlaylist, handleSubmit, register, errors }: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Редактировать плейлист</h2>
      <div>
        <input {...register("title")} placeholder="Title" />
        <span className='error'>{errors?.title?.message}</span>
      </div>
      <div>
        <input {...register("description")} placeholder={"Description"} />
        <span className='error'>{errors?.description?.message}</span>
      </div>
      <button>Сохранить</button>
      <button type={"button"} onClick={() => editPlaylist(null)}>
        Отмена
      </button>
    </form>
  )
}
