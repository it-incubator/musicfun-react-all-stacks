import type { Nullable } from "@/common"
import type { TrackDetails, TrackListItemAttributes } from "../../../../../api/tracksApi.types.ts"

type Props = {
  track: TrackDetails<TrackListItemAttributes>
  removeTrack: (trackId: string) => void
  removingTrackId: Nullable<string>
}

export const TrackActions = ({ removingTrackId, removeTrack, track }: Props) => {
  return (
    <>
      <button onClick={() => removeTrack(track.id)} disabled={removingTrackId === track.id}>
        {removingTrackId === track.id ? "Удаление..." : "Удалить"}
      </button>
    </>
  )
}
