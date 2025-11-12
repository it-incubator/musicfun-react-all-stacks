import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '@/shared/hooks'

import { openCreateTrackModal, selectIsCreateEditTrackModalOpen } from '../tracks-slice'

export const useCreateTrackModal = () => {
  const dispatch = useAppDispatch()
  const isCreateTrackModalOpen = useAppSelector(selectIsCreateEditTrackModalOpen)

  const handleOpenCreateTrackModal = useCallback(() => {
    dispatch(openCreateTrackModal())
  }, [dispatch])

  return {
    isCreateTrackModalOpen,
    handleOpenCreateTrackModal,
  }
}
