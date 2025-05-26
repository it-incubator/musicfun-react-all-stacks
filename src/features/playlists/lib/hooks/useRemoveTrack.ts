import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { type Nullable, showErrorToast } from "@/common"
import { queryClient } from "@/main.tsx"
import { TrackQueryKey, tracksApi } from "../../../tracks/api/tracksApi.ts"

export const useRemoveTrack = () => {
  const [removingTrackId, setRemovingTrackId] = useState<Nullable<string>>(null)

  const { mutate: removeTrackMutation } = useMutation({
    mutationFn: tracksApi.removeTrack,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TrackQueryKey] }),
    onError: (err: unknown) => showErrorToast("Не удалось удалить трек", err),
    onSettled: () => setRemovingTrackId(null),
  })

  const removeTrack = (trackId: string) => {
    if (confirm("Вы уверены, что хотите удалить трек?")) {
      setRemovingTrackId(trackId)
      removeTrackMutation(trackId)
    }
  }

  return { removeTrack, removingTrackId }
}
