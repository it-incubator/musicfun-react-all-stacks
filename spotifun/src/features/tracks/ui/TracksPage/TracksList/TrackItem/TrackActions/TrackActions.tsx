import type { MouseEvent } from "react"
import type { Nullable } from "@/common/types"
import type { FetchTracksAttributes, TrackDetails } from "../../../../../api/tracksApi.types.ts"

type Props = {
  track: TrackDetails<FetchTracksAttributes>
  removeTrack: () => void
  removingTrackId: Nullable<string>
  addTrackToPlaylist: () => void
  editTrack: (e: MouseEvent) => void
}

export const TrackActions = ({ removingTrackId, removeTrack, track, addTrackToPlaylist, editTrack }: Props) => {
  const addTrackToPlaylistHandler = (e: MouseEvent) => {
    e.preventDefault()
    addTrackToPlaylist()
  }

  const removeTrackHandler = (e: MouseEvent) => {
    e.preventDefault()
    removeTrack()
  }

  return (
    <div>
      <button onClick={addTrackToPlaylistHandler}>Добавить трек в плейлист</button>
      <button onClick={(e) => editTrack(e)}>Редактировать</button>
      <button onClick={removeTrackHandler} disabled={removingTrackId === track.id}>
        {removingTrackId === track.id ? "Удаление..." : "Удалить"}
      </button>
    </div>
  )
}
