import type { Nullable } from "@/common"
import type { TrackDetails, BaseAttributes } from "../../../../../api/tracksApi.types.ts"

type Props = {
  track: TrackDetails<BaseAttributes>
  removeTrack: () => void
  removingTrackId: Nullable<string>
  editTrack: () => void
  addTrackToPlaylist: () => void
}

export const TrackActions = ({ removingTrackId, removeTrack, track, editTrack, addTrackToPlaylist }: Props) => {
  return (
    <div>
      <button onClick={addTrackToPlaylist}>Добавить трек в плейлист</button>
      <button onClick={editTrack}>Редактировать</button>
      <button onClick={removeTrack} disabled={removingTrackId === track.id}>
        {removingTrackId === track.id ? "Удаление..." : "Удалить"}
      </button>
    </div>
  )
}
