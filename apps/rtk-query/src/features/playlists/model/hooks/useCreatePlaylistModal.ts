import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '@/shared/hooks'

import { openCreateModal, selectIsCreateEditModalOpen } from '../playlists-slice'

export const useCreatePlaylistModal = () => {
  const dispatch = useAppDispatch()
  const isCreatePlaylistModalOpen = useAppSelector(selectIsCreateEditModalOpen)

  const handleOpenCreatePlaylistModal = useCallback(() => {
    dispatch(openCreateModal())
  }, [dispatch])

  return {
    isCreatePlaylistModalOpen,
    handleOpenCreatePlaylistModal,
  }
}
