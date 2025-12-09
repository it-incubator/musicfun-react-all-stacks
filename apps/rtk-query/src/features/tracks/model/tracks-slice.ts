import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  createEditModal: {
    isOpen: false,
    trackId: null as string | null,
  },
}

export const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    openCreateTrackModal: (state) => {
      state.createEditModal.isOpen = true
      state.createEditModal.trackId = null
    },
    openEditTrackModal: (state, action: PayloadAction<string>) => {
      state.createEditModal.isOpen = true
      state.createEditModal.trackId = action.payload
    },
    closeCreateEditTrackModal: (state) => {
      state.createEditModal.isOpen = false
      state.createEditModal.trackId = null
    },
  },
  selectors: {
    selectCreateEditTrackModal: (state) => state.createEditModal,
    selectIsCreateEditTrackModalOpen: (state) => state.createEditModal.isOpen,
    selectEditingTrackId: (state) => state.createEditModal.trackId,
  },
})

export const { openCreateTrackModal, openEditTrackModal, closeCreateEditTrackModal } =
  tracksSlice.actions
export const {
  selectCreateEditTrackModal,
  selectIsCreateEditTrackModalOpen,
  selectEditingTrackId,
} = tracksSlice.selectors
