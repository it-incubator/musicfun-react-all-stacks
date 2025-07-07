import { tracksKey } from '@/common/apiEntities'
import type { Nullable } from '@/common/types'
import { showErrorToast, showSuccessToast } from '@/common/utils'
import { tracksApi } from '../../api/tracksApi.ts'
import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'
import { type MouseEvent, useState } from 'react'

export const useAddToPlaylist = () => {
  const [modalTrackId, setModalTrackId] = useState<Nullable<string>>(null)
  const [playlistId, setPlaylistId] = useState<Nullable<string>>(null)

  const { mutate } = useMutation({
    mutationFn: tracksApi.addTrackToPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tracksKey] })
      setModalTrackId(null)
      showSuccessToast(`Трек успешно добавлен ${playlistId}`)
      queryClient.removeQueries({ queryKey: [tracksKey, playlistId] })
    },
    onError: (err: unknown) => showErrorToast('Ошибка при добавлении трека в плейлист', err),
  })

  const openModal = (e: MouseEvent, trackId: string) => {
    e.preventDefault()
    setModalTrackId(trackId)
  }

  const addTrackToPlaylist = (playlistId: string) => {
    if (!modalTrackId) return
    setPlaylistId(playlistId)
    mutate({ trackId: modalTrackId, playlistId })
  }

  return { modalTrackId, setModalTrackId, addTrackToPlaylist, openModal }
}
