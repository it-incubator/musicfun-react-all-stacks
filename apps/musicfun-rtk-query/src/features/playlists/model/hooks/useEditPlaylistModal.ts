import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '@/shared/hooks'

import {
  openEditModal,
  selectEditingPlaylistId,
  selectIsCreateEditModalOpen,
} from '../playlists-slice'

export const useEditPlaylistModal = (playlistId: string) => {
  const dispatch = useAppDispatch()
  const isCreateEditModalOpen = useAppSelector(selectIsCreateEditModalOpen)
  const editingPlaylistId = useAppSelector(selectEditingPlaylistId)

  const handleOpenEditPlaylistModal = useCallback(() => {
    dispatch(openEditModal(playlistId))
  }, [dispatch, playlistId])

  return {
    isEditPlaylistModalOpen: isCreateEditModalOpen && editingPlaylistId,
    handleOpenEditPlaylistModal,
  }
}
