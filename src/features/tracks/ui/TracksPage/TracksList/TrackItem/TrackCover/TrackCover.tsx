import trackDefaultCover from "@/assets/img/track-default-cover.jpg"
import { showErrorToast } from "@/common"
import type { TrackDetails, TrackListItemAttributes } from "@/features/tracks/api/tracksApi.types.ts"
import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import type { ChangeEvent } from "react"
import { TrackQueryKey, tracksApi } from "../../../../../api/tracksApi.ts"
import s from "./TrackCover.module.css"

type Props = {
  track: TrackDetails<TrackListItemAttributes>
}

export const TrackCover = ({ track }: Props) => {
  const { mutate } = useMutation({
    mutationFn: tracksApi.uploadTrackCover,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
    },
  })

  // TODO. Дублирование с PlaylistCover. Когда пойму что нужно
  //  для загрузки обложки трека, тогда и пофикшу
  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showErrorToast("Загрузите изображение")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showErrorToast("Файл слишком большой (макс. 5 МБ)")
      return
    }

    const playlistId = "ca8851c9-7d20-413a-a5f6-6b572d255c84"

    mutate({ playlistId, trackId: track.id, file })
  }

  return (
    <div>
      <img src={trackDefaultCover} className={s.cover} alt={"no cover"} />
      <div>
        <input type="file" accept="image/*" onChange={uploadHandler} />
      </div>
    </div>
  )
}
