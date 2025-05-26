import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { type Nullable, showErrorToast, showSuccessToast } from "@/common"
import { TrackQueryKey, tracksApi } from "@/features/tracks/api/tracksApi.ts"
import { queryClient } from "@/main.tsx"

export const useAddToPlaylist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTrackId, setModalTrackId] = useState<Nullable<string>>(null)

  const { mutate: addTrackToPlaylistMutation } = useMutation({
    mutationFn: tracksApi.addTrackToPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      setIsModalOpen(false)
      showSuccessToast("Трек успешно добавлен")
    },
    onError: (err: unknown) => showErrorToast("Ошибка при добавлении трека в плейлсит", err),
  })

  const submitAddTrackToPlaylistModal = (trackId: string) => {
    setModalTrackId(trackId)
    setIsModalOpen(true)
  }

  const addTrackToPlaylistHandler = (playlistId: string) => {
    if (!modalTrackId) return
    addTrackToPlaylistMutation({ trackId: modalTrackId, playlistId })
  }

  return { isModalOpen, submitAddTrackToPlaylistModal, addTrackToPlaylistHandler, setIsModalOpen }
}
