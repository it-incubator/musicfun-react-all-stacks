import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from "react-hook-form"
import type { Nullable } from "@/common"
import { SelectPlaylists } from "../../../../../playlists/lib/components/SelectPlaylists/SelectPlaylists.tsx"
import type { UpdateTrackArgs } from "../../../../api/tracksApi.types.ts"

type Props = {
  editTrack: () => void
  register: UseFormRegister<UpdateTrackArgs>
  handleSubmit: UseFormHandleSubmit<UpdateTrackArgs>
  onSubmit: SubmitHandler<UpdateTrackArgs>
  playlistId: Nullable<string>
  setPlaylistId: (playlistId: Nullable<string>) => void
}

export const EditTrackForm = ({ editTrack, register, handleSubmit, onSubmit, setPlaylistId, playlistId }: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Редактировать трек</h2>
      <div>
        <input {...register("title")} placeholder="Title" />
      </div>
      <div>
        <input {...register("lyrics")} placeholder="Lyrics" />
      </div>
      <div>
        <span> 🤔 Как понять в каком плейлисте находится трек, хз</span>
        <SelectPlaylists onChange={setPlaylistId} value={playlistId ?? ""} />
      </div>
      <button type={"submit"}>Сохранить</button>
      <button type={"button"} onClick={editTrack}>
        Отмена
      </button>
    </form>
  )
}
