import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { type Nullable, showErrorToast } from "@/common"
import { queryClient } from "@/main.tsx"
import type { TrackDetails, TrackSummaryAttributes, UpdateTrackArgs } from "../../api/tracksApi.types.ts"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"

export const useEditTrack = () => {
  const [trackId, setTrackId] = useState<Nullable<string>>(null)
  const [playlistId, setPlaylistId] = useState<Nullable<string>>(null)

  const { register, handleSubmit, reset } = useForm<UpdateTrackArgs>()

  const { mutate } = useMutation({
    mutationFn: tracksApi.updateTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      setTrackId(null)
    },
    onError: (err: unknown) => showErrorToast("Ошибка при обновлении трека", err),
  })

  const editTrackHandler = (track: Nullable<TrackDetails<TrackSummaryAttributes>>) => {
    setTrackId(track?.id ?? null)

    if (track) {
      const { attributes } = track
      // TODO: как мне подтянуть свойства трека (например lyrics),
      //  чтобы их можно было обновить если в треке не содержится эта информация
      reset({ title: attributes.title })
    }
  }

  const onSubmit: SubmitHandler<UpdateTrackArgs> = (payload) => {
    if (!trackId || !playlistId) return
    mutate({ trackId, playlistId, payload })
  }

  return { register, handleSubmit, onSubmit, trackId, editTrackHandler, playlistId, setPlaylistId }
}
