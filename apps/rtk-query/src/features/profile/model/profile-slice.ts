import { createSlice } from '@reduxjs/toolkit'

import { localStorageKeys } from '@/app/api/base-query-with-refresh-token-flow-api'
import type { FullName } from '@/features/profile'
import { emptyProfile, PROFILE_STORAGE_KEY } from '@/features/profile'

const initialState = {
  createEditModal: {
    isOpen: false,
  },
  profile: emptyProfile,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: (create) => ({
    setEditProfileModalOpen: create.reducer<boolean>((state, action) => {
      state.createEditModal.isOpen = action.payload
    }),
    setProfileAvatar: create.reducer<string | null>((state, action) => {
      state.profile.avatar = action.payload
    }),
    setProfileFullName: create.reducer<FullName>((state, action) => {
      state.profile.fullName = action.payload
    }),
    //! FIXME: temporary implementation until backend issue #160 is fixed
    hydrateProfileFromStorage: create.reducer((state) => {
      const hasToken = !!localStorage.getItem(localStorageKeys.accessToken)
      if (!hasToken) {
        state.profile = emptyProfile
        return
      }

      const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (stored) {
        state.profile = JSON.parse(stored)
      }
    }),
  }),
  selectors: {
    selectIsEditProfileModalOpen: (state) => state.createEditModal.isOpen,
    selectProfileAvatar: (state) => state.profile.avatar,
    selectProfileFullName: (state) => state.profile.fullName,
  },
})

export const {
  setEditProfileModalOpen,
  setProfileAvatar,
  setProfileFullName,
  hydrateProfileFromStorage,
} = profileSlice.actions
export const { selectIsEditProfileModalOpen, selectProfileAvatar, selectProfileFullName } =
  profileSlice.selectors
