import type { Nullable } from "@/common"
import type { Playlist } from "@/features/playlists/api/playlistsApi.types.ts"
import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from "react-hook-form"
import type { UpdateTrackArgs } from "../../../../api/tracksApi.types.ts"

type Props = {
  editTrack: () => void
  register: UseFormRegister<UpdateTrackArgs>
  handleSubmit: UseFormHandleSubmit<UpdateTrackArgs>
  onSubmit: SubmitHandler<UpdateTrackArgs>
  playlists: Playlist[]
  playlistId: Nullable<string>
  setPlaylistId: (playlistId: Nullable<string>) => void
}

export const EditTrackForm = ({
  editTrack,
  register,
  handleSubmit,
  onSubmit,
  playlists,
  setPlaylistId,
  playlistId,
}: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Редактировать трек</h2>
      <div>
        <input {...register("title")} placeholder="Title" />
      </div>
      <div>
        <input {...register("lyrics")} placeholder="Lyrics" />
      </div>

      {/*TODO: Дублирование селекта с AddTrackForm. Прежде чем писать обертку обсудить бекенд*/}
      <div>
        <label>
          Выберите плейлист:
          <select onChange={(e) => setPlaylistId(e.target.value)} value={playlistId ?? ""}>
            <option value="" disabled>
              -- Выберите плейлист --
            </option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.attributes.title}
              </option>
            ))}
          </select>
          🤔 Как понять в каком плейлисте находится трек, хз )
        </label>
      </div>

      <button type={"submit"}>Сохранить</button>
      <button type={"button"} onClick={editTrack}>
        Отмена
      </button>
    </form>
  )
}
