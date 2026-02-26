import { useCallback } from 'react'

import { useProfileStore } from '../profile-store'

export const useEditProfileModal = () => {
  const isEditProfileOpen = useProfileStore((state) => state.isEditProfileModalOpen)
  const setEditProfileModalOpen = useProfileStore((state) => state.setEditProfileModalOpen)

  const handleOpenEditProfileModal = useCallback(() => {
    setEditProfileModalOpen(true)
  }, [setEditProfileModalOpen])

  return {
    isEditProfileOpen,
    handleOpenEditProfileModal,
  }
}
