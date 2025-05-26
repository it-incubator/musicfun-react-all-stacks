import type { Nullable } from "@/common"
import type { TrackDetails, TrackListItemAttributes } from "../../../../../api/tracksApi.types.ts"

type Props = {
  track: TrackDetails<TrackListItemAttributes>
  removeTrack: () => void
  removingTrackId: Nullable<string>
  editTrack: () => void
}

export const TrackActions = ({ removingTrackId, removeTrack, track, editTrack }: Props) => {
  return (
    <div>
      <button onClick={editTrack}>Редактировать</button>
      <button onClick={removeTrack} disabled={removingTrackId === track.id}>
        {removingTrackId === track.id ? "Удаление..." : "Удалить"}
      </button>
    </div>
  )
}
