import { useState } from "react"
import type { MouseEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import type { Nullable } from "@/common/types"
import { showErrorToast } from "@/common/utils"
import { queryClient } from "@/main.tsx"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"
import type { PlaylistItemAttributes, TrackDetails, UpdateTrackArgs } from "../../api/tracksApi.types.ts"

export const useEditTrack = () => {
  const [trackId, setTrackId] = useState<Nullable<string>>(null)

  const { register, handleSubmit, reset } = useForm<UpdateTrackArgs>()

  const { mutate } = useMutation({
    mutationFn: tracksApi.updateTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      setTrackId(null)
    },
    onError: (err: unknown) => showErrorToast("Ошибка при обновлении трека", err),
  })

  const editTrackHandler = (e: MouseEvent, track: Nullable<TrackDetails<PlaylistItemAttributes>>) => {
    e.preventDefault()

    setTrackId(track?.id ?? null)

    if (track) {
      const { attributes } = track
      // TODO: как мне подтянуть свойства трека (например lyrics),
      //  чтобы их можно было обновить если в треке не содержится эта информация
      reset({ title: attributes.title })
    }
  }

  const onSubmit: SubmitHandler<UpdateTrackArgs> = (payload) => {
    if (!trackId) return
    mutate({ trackId, payload })
  }

  return { register, handleSubmit, onSubmit, trackId, editTrackHandler }
}
