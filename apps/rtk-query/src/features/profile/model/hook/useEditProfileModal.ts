import { useCallback } from 'react'

import { openEditProfileModal, selectIsEditProfileModalOpen } from '@/features/profile'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export const useEditProfileModal = () => {
  const dispatch = useAppDispatch()

  const isEditProfileOpen = useAppSelector(selectIsEditProfileModalOpen)

  const handleOpenEditProfileModal = useCallback(() => {
    dispatch(openEditProfileModal())
  }, [dispatch])

  return {
    isEditProfileOpen,
    handleOpenEditProfileModal,
  }
}
