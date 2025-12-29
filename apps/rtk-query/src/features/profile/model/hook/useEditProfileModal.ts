import { useCallback } from 'react'

import { selectIsEditProfileModalOpen, setEditProfileModalOpen } from '@/features/profile'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export const useEditProfileModal = () => {
  const dispatch = useAppDispatch()

  const isEditProfileOpen = useAppSelector(selectIsEditProfileModalOpen)

  const handleOpenEditProfileModal = useCallback(() => {
    dispatch(setEditProfileModalOpen(true))
  }, [dispatch])

  return {
    isEditProfileOpen,
    handleOpenEditProfileModal,
  }
}
