import { type MouseEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { showErrorToast } from "@/common/utils"
import type { Nullable } from "@/common/types"
import { queryClient } from "@/main.tsx"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"

export const useRemoveTrack = () => {
  const [removingTrackId, setRemovingTrackId] = useState<Nullable<string>>(null)

  const { mutate } = useMutation({
    mutationFn: tracksApi.removeTrack,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TrackQueryKey] }),
    onError: (err: unknown) => showErrorToast("Не удалось удалить трек", err),
    onSettled: () => setRemovingTrackId(null),
  })

  const removeTrack = (e: MouseEvent, trackId: string) => {
    e.preventDefault()
    if (confirm("Вы уверены, что хотите удалить трек?")) {
      setRemovingTrackId(trackId)
      mutate(trackId)
    }
  }

  return { removeTrack, removingTrackId }
}
