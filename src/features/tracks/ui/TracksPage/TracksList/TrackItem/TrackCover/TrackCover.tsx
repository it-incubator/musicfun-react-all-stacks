import type { ChangeEvent, MouseEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import trackDefaultCover from "@/assets/img/track-default-cover.jpg"
import { showErrorToast } from "@/common/utils"
import { queryClient } from "@/main.tsx"
import { TrackQueryKey, tracksApi } from "../../../../../api/tracksApi.ts"
import type { BaseAttributes, TrackDetails } from "../../../../../api/tracksApi.types.ts"
import s from "./TrackCover.module.css"

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
}

export const TrackCover = <T extends BaseAttributes>({ track }: Props<T>) => {
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

  const stopPropagationHandler = (e: MouseEvent<HTMLInputElement>) => e.stopPropagation()

  return (
    <div className={"flex-container-column"}>
      <img src={trackDefaultCover} className={s.cover} alt={"no cover"} />
      <input type="file" accept="image/*" onChange={uploadHandler} onClick={stopPropagationHandler} />
    </div>
  )
}
