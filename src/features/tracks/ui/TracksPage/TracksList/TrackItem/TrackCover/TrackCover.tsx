import trackDefaultCover from "@/assets/img/track-default-cover.jpg"
import { uploadCover } from "@/common/utils/uploadCover.ts"
import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import type { ChangeEvent, MouseEvent } from "react"
import { TrackQueryKey, tracksApi } from "../../../../../api/tracksApi.ts"
import type { BaseAttributes, TrackDetails } from "../../../../../api/tracksApi.types.ts"
import s from "./TrackCover.module.css"

type Props<T extends BaseAttributes> = {
  // track: TrackDetails<T>
  track: any
}

export const TrackCover = <T extends BaseAttributes>({ track }: Props<T>) => {
  const { mutate } = useMutation({
    mutationFn: tracksApi.uploadTrackCover,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
    },
  })

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    uploadCover({
      event,
      maxSize: 100 * 1024,
      onSuccess: (file) => mutate({ trackId: track.id, file }),
    })
  }

  const stopPropagationHandler = (e: MouseEvent<HTMLInputElement>) => e.stopPropagation()

  debugger

  const originalCover = track.attributes.images.find((img) => img.type === "original")
  // const originalCover = track.attributes.images.main.find((img) => img.type === "original")

  return (
    <div className={"flex-container-column"}>
      <img src={originalCover ? originalCover.url : trackDefaultCover} alt={"no cover image"} className={s.cover} />
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={uploadCoverHandler}
        onClick={stopPropagationHandler}
      />
    </div>
  )
}
