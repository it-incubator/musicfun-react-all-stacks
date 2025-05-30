import type { Nullable } from "@/common/types"
import { showErrorToast } from "@/common/utils"
import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import type { MouseEvent } from "react"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"
import type { BaseAttributes, TrackDetails, UpdateTrackArgs } from "../../api/tracksApi.types.ts"

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

  // TracksList -         Nullable<TrackDetails<FetchTracksAttributes>>
  // TrackPage -          Nullable<TrackDetails<TrackDetailAttributes>>
  // PlaylistTracks -     Nullable<TrackDetails<PlaylistItemAttributes>>
  const editTrack = <T extends BaseAttributes>(e: MouseEvent, track: Nullable<TrackDetails<T>>) => {
    e.preventDefault()

    setTrackId(track?.id ?? null)

    if (track) {
      const { attributes } = track
      // TODO: как мне подтянуть свойства трека (например lyrics),
      // чтобы их можно было обновить если в треке не содержится эта информация
      // Это можно реализовать только на странице трека TrackPage
      reset({ title: attributes.title })
    }
  }

  const onSubmit: SubmitHandler<UpdateTrackArgs> = (payload) => {
    if (!trackId) return
    mutate({ trackId, payload })
  }

  return { register, handleSubmit, onSubmit, trackId, editTrack }
}
