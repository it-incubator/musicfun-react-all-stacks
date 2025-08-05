import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '@/shared/hooks'

import {
  openEditTrackModal,
  selectEditingTrackId,
  selectIsCreateEditTrackModalOpen,
} from '../tracks-slice'

export const useEditTrackModal = () => {
  const dispatch = useAppDispatch()
  const isCreateEditTrackModalOpen = useAppSelector(selectIsCreateEditTrackModalOpen)
  const editingTrackId = useAppSelector(selectEditingTrackId)

  const handleOpenEditTrackModal = useCallback(
    (trackId: string) => {
      dispatch(openEditTrackModal(trackId))
    },
    [dispatch]
  )

  return {
    isEditTrackModalOpen: isCreateEditTrackModalOpen && editingTrackId,
    handleOpenEditTrackModal,
  }
}
