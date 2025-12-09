import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  createEditModal: {
    isOpen: false,
    playlistId: null as string | null,
  },
}

export const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.createEditModal.isOpen = true
      state.createEditModal.playlistId = null
    },
    openEditModal: (state, action: PayloadAction<string>) => {
      state.createEditModal.isOpen = true
      state.createEditModal.playlistId = action.payload
    },
    closeCreateEditModal: (state) => {
      state.createEditModal.isOpen = false
      state.createEditModal.playlistId = null
    },
  },
  selectors: {
    selectCreateEditModal: (state) => state.createEditModal,
    selectIsCreateEditModalOpen: (state) => state.createEditModal.isOpen,
    selectEditingPlaylistId: (state) => state.createEditModal.playlistId,
  },
})

export const { openCreateModal, openEditModal, closeCreateEditModal } = playlistsSlice.actions
export const { selectCreateEditModal, selectIsCreateEditModalOpen, selectEditingPlaylistId } =
  playlistsSlice.selectors
