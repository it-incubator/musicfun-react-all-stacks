import type { MouseEvent } from "react"
import type { Nullable } from "@/common/types"
import type { FetchTracksAttributes, TrackDetails } from "../../../../../api/tracksApi.types.ts"

type Props = {
  track: TrackDetails<FetchTracksAttributes>
  removeTrack: () => void
  removingTrackId: Nullable<string>
  addTrackToPlaylist: () => void
}

export const TrackActions = ({ removingTrackId, removeTrack, track, addTrackToPlaylist }: Props) => {
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
      <button onClick={removeTrackHandler} disabled={removingTrackId === track.id}>
        {removingTrackId === track.id ? "Удаление..." : "Удалить"}
      </button>
    </div>
  )
}
