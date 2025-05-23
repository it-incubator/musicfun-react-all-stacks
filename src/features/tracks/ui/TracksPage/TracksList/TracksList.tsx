import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { type Nullable, showErrorToast } from "@/common"
import { queryClient } from "@/main.tsx"
import { TrackQueryKey, tracksApi } from "../../../api/tracksApi.ts"
import type { TrackDetails, TrackListItemAttributes } from "../../../api/tracksApi.types.ts"
import s from "./TracksList.module.css"

type Props = {
  tracks: TrackDetails<TrackListItemAttributes>[]
}

export const TracksList = ({ tracks }: Props) => {
  const [removingTrackId, setRemovingTrackId] = useState<Nullable<string>>(null)

  const { mutate } = useMutation({
    mutationFn: tracksApi.removeTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
    },
    onError: (error: unknown) => {
      showErrorToast("Не удалось удалить трек", error)
    },
    onSettled: () => {
      setRemovingTrackId(null)
    },
  })

  const removeTrackHandler = (trackId: string) => {
    if (confirm("Вы уверены, что хотите удалить трек?")) {
      setRemovingTrackId(trackId)
      mutate(trackId)
    }
  }

  return (
    <div className={s.container}>
      {tracks.map((track) => {
        const { title, addedAt } = track.attributes

        return (
          <div className={"item item--fullwidth"} key={track.id}>
            <div>
              <b>title:</b> <span>{title}</span>
            </div>
            <div>
              <b>added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
            </div>
            <button onClick={() => removeTrackHandler(track.id)} disabled={removingTrackId === track.id}>
              {removingTrackId === track.id ? "Удаление..." : "Удалить"}
            </button>
          </div>
        )
      })}
    </div>
  )
}
