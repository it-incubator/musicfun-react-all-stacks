import trackDefaultCover from "@/assets/img/track-default-cover.jpg"
import { showErrorToast } from "@/common/utils"
import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import type { ChangeEvent, MouseEvent } from "react"
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

  // TODO. Дублирование с PlaylistCover.
  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]

    if (!allowedTypes.includes(file.type)) {
      showErrorToast("Разрешены только изображения JPEG, PNG или GIF")
      return
    }

    if (file.size > 100 * 1024) {
      showErrorToast("Файл слишком большой (макс. 100 КБ)")
      return
    }

    mutate({ trackId: track.id, file })
  }

  const stopPropagationHandler = (e: MouseEvent<HTMLInputElement>) => e.stopPropagation()

  const originalCover = track.attributes.images.find((img) => img.type === "original")

  return (
    <div className={"flex-container-column"}>
      <img src={originalCover ? originalCover.url : trackDefaultCover} alt={"no cover image"} className={s.cover} />
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={uploadHandler}
        onClick={stopPropagationHandler}
      />
    </div>
  )
}
