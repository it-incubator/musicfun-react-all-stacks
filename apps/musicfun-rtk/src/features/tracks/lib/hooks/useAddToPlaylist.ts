import type { Nullable } from '@/common/types'
import { successToast } from '@/common/utils'
import { useAddTrackToPlaylistMutation } from '../../api/tracksApi.ts'
import { type MouseEvent, useState } from 'react'

export const useAddToPlaylist = () => {
  const [modalTrackId, setModalTrackId] = useState<Nullable<string>>(null)

  const [mutate] = useAddTrackToPlaylistMutation()

  const openModal = (e: MouseEvent, trackId: string) => {
    e.preventDefault()
    setModalTrackId(trackId)
  }

  const addTrackToPlaylist = (playlistId: string) => {
    if (!modalTrackId) return
    mutate({ trackId: modalTrackId, playlistId })
      .unwrap()
      .then(() => {
        successToast(`Track successfully added ${playlistId}`)
      })
  }

  return { modalTrackId, setModalTrackId, addTrackToPlaylist, openModal }
}
