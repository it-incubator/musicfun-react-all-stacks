import type { MouseEvent } from "react"
import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from "react-hook-form"
import type { UpdateTrackArgs } from "../../../../api/tracksApi.types.ts"

type Props = {
  editTrack: (e: MouseEvent) => void
  register: UseFormRegister<UpdateTrackArgs>
  handleSubmit: UseFormHandleSubmit<UpdateTrackArgs>
  onSubmit: SubmitHandler<UpdateTrackArgs>
}

export const EditTrackForm = ({ editTrack, register, handleSubmit, onSubmit }: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"item item--fullwidth"}>
      <h2>Редактировать трек</h2>
      <div>
        <input {...register("title")} placeholder="Title" />
      </div>
      <div>
        <input {...register("lyrics")} placeholder="Lyrics" />
      </div>
      <button type={"submit"}>Сохранить</button>
      <button type={"button"} onClick={editTrack}>
        Отмена
      </button>
    </form>
  )
}
