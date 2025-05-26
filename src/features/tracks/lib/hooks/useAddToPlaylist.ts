import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { type Nullable, showErrorToast, showSuccessToast } from "@/common"
import { TrackQueryKey, tracksApi } from "../../api/tracksApi.ts"
import { queryClient } from "@/main.tsx"

export const useAddToPlaylist = () => {
  const [modalTrackId, setModalTrackId] = useState<Nullable<string>>(null)

  const { mutate } = useMutation({
    mutationFn: tracksApi.addTrackToPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      setModalTrackId(null)
      showSuccessToast("Трек успешно добавлен")
    },
    onError: (err: unknown) => showErrorToast("Ошибка при добавлении трека в плейлсит", err),
  })

  const addTrackToPlaylist = (playlistId: string) => {
    if (!modalTrackId) return
    mutate({ trackId: modalTrackId, playlistId })
  }

  return { modalTrackId, setModalTrackId, addTrackToPlaylist }
}
