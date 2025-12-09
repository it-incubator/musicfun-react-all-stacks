import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '@/shared/hooks'

import {
  openEditModal,
  selectEditingPlaylistId,
  selectIsCreateEditModalOpen,
} from '../playlists-slice'

export const useEditPlaylistModal = () => {
  const dispatch = useAppDispatch()
  const isCreateEditModalOpen = useAppSelector(selectIsCreateEditModalOpen)
  const editingPlaylistId = useAppSelector(selectEditingPlaylistId)

  const handleOpenEditPlaylistModal = useCallback(
    (playlistId: string) => {
      dispatch(openEditModal(playlistId))
    },
    [dispatch]
  )

  return {
    isEditPlaylistModalOpen: isCreateEditModalOpen && editingPlaylistId,
    handleOpenEditPlaylistModal,
  }
}
