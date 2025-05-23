import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/main.tsx"
import type { Nullable } from "@/common"
import { toast } from "react-toastify"
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
      toast("Не удалось удалить трек", { theme: "colored", type: "error" })
      console.error("Ошибка при удалении трека:", error)
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
