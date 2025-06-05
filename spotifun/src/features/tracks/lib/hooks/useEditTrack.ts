import { tracksKey } from "@/common/apiEntities"
import type { Nullable } from "@/common/types"
import { showErrorToast, showSuccessToast } from "@/common/utils"
import { queryClient } from "@/main.tsx"
import { useMutation, useQuery } from "@tanstack/react-query"
import { type MouseEvent, useEffect, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { tracksApi } from "../../api/tracksApi.ts"
import type { UpdateTrackArgs } from "../../api/tracksApi.types.ts"

export const useEditTrack = () => {
  const [trackId, setTrackId] = useState<Nullable<string>>(null)
  const [enabled, setEnabled] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { register, handleSubmit, reset } = useForm<UpdateTrackArgs>()

  const { mutate } = useMutation({
    mutationFn: tracksApi.updateTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tracksKey] })
      setTrackId(null)
      showSuccessToast("Трек успешно обновлен")
    },
    onError: (err: unknown) => showErrorToast("Ошибка при обновлении трека", err),
  })

  const { data: trackResponse } = useQuery({
    queryKey: [tracksKey, trackId],
    queryFn: () => tracksApi.fetchTrackById(trackId as string),
    enabled,
  })

  useEffect(() => {
    if (trackResponse) {
      const { title, lyrics, tags } = trackResponse.data.data.attributes
      reset({ title, lyrics: lyrics ?? "" })
      setSelectedTags(tags?.map((tag) => tag.id) ?? [])
      setEnabled(false)
    }
  }, [trackResponse, reset])

  const editTrack = (e: MouseEvent, trackId: Nullable<string>) => {
    e.preventDefault()
    setTrackId(trackId ?? null)

    if (!trackId) return
    setEnabled(true)
  }

  const onSubmit: SubmitHandler<UpdateTrackArgs> = (payload) => {
    if (!trackId) return
    const fullPayload = { ...payload, tagIds: selectedTags }
    mutate({ trackId, payload: fullPayload })
  }

  return { register, handleSubmit, onSubmit, trackId, editTrack, selectedTags, setSelectedTags }
}
