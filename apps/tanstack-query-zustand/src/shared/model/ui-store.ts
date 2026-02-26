import { create } from 'zustand'

interface UIState {
  isCreatePlaylistModalOpen: boolean
  isCreateTrackModalOpen: boolean
  isAuthModalOpen: boolean
  editingPlaylistId: string | null
  editingTrackId: string | null

  openCreatePlaylistModal: (id?: string) => void
  closeCreatePlaylistModal: () => void

  openCreateTrackModal: (id?: string) => void
  closeCreateTrackModal: () => void

  openAuthModal: () => void
  closeAuthModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isCreatePlaylistModalOpen: false,
  isCreateTrackModalOpen: false,
  isAuthModalOpen: false,
  editingPlaylistId: null,
  editingTrackId: null,

  openCreatePlaylistModal: (id) =>
    set({
      isCreatePlaylistModalOpen: true,
      editingPlaylistId: id || null,
    }),
  closeCreatePlaylistModal: () =>
    set({
      isCreatePlaylistModalOpen: false,
      editingPlaylistId: null,
    }),

  openCreateTrackModal: (id) =>
    set({
      isCreateTrackModalOpen: true,
      editingTrackId: id || null,
    }),
  closeCreateTrackModal: () =>
    set({
      isCreateTrackModalOpen: false,
      editingTrackId: null,
    }),

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}))
