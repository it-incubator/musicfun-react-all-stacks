import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { type Nullable, showErrorToast } from "@/common"
import { queryClient } from "@/main.tsx"
import { TrackItem } from "./TrackItem/TrackItem.tsx"
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
        return (
          <TrackItem key={track.id} track={track} removeTrack={removeTrackHandler} removingTrackId={removingTrackId} />
        )
      })}
    </div>
  )
}
