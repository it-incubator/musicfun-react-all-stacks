import { createSlice } from '@reduxjs/toolkit'

import type { FullName, Profile } from '@/features/profile'
import { PROFILE_STORAGE_KEY } from '@/features/profile'
import { emptyProfile } from '@/features/profile/utils'

const preloadedState = JSON.parse(
  localStorage.getItem(PROFILE_STORAGE_KEY) ?? JSON.stringify(emptyProfile)
) as Profile //! temporary implementation

const initialState = {
  createEditModal: {
    isOpen: false,
  },
  profile: preloadedState,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: (create) => ({
    openEditProfileModal: create.reducer((state) => {
      state.createEditModal.isOpen = true
    }),
    closeEditProfileModal: create.reducer((state) => {
      state.createEditModal.isOpen = false
    }),
    setProfileAvatar: create.reducer<string | null>((state, action) => {
      state.profile.avatar = action.payload
    }),
    setProfileFullName: create.reducer<FullName>((state, action) => {
      state.profile.fullName = action.payload
    }),
    clearProfileState: create.reducer((state) => {
      state.profile = emptyProfile
    }),
  }),
  selectors: {
    selectIsEditProfileModalOpen: (state) => state.createEditModal.isOpen,
    selectProfileAvatar: (state) => state.profile.avatar,
    selectProfileFullName: (state) => state.profile.fullName,
  },
})

export const {
  openEditProfileModal,
  closeEditProfileModal,
  setProfileAvatar,
  setProfileFullName,
  clearProfileState,
} = profileSlice.actions
export const { selectIsEditProfileModalOpen, selectProfileAvatar, selectProfileFullName } =
  profileSlice.selectors
