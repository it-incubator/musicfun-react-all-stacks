import { create } from 'zustand'

import { authStorage } from '@/shared/utils/authStorage'

import { emptyProfile } from '../config/empty-profile'
import type { FullName, Profile } from '../types/profile.types'
import { profileStorage } from '../utils/profile-storage'

type ProfileStore = {
  isEditProfileModalOpen: boolean
  profile: Profile
  setEditProfileModalOpen: (isOpen: boolean) => void
  setProfileAvatar: (avatar: string | null) => void
  setProfileFullName: (fullName: FullName) => void
  hydrateProfileFromStorage: (userId?: string) => void
  resetProfile: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isEditProfileModalOpen: false,
  profile: emptyProfile,

  setEditProfileModalOpen: (isOpen) => set({ isEditProfileModalOpen: isOpen }),
  setProfileAvatar: (avatar) => set((state) => ({ profile: { ...state.profile, avatar } })),
  setProfileFullName: (fullName) => set((state) => ({ profile: { ...state.profile, fullName } })),

  hydrateProfileFromStorage: (userId) => {
    const hasToken = !!authStorage.getAccessToken()
    if (!hasToken || !userId) {
      set({ profile: emptyProfile })
      return
    }

    const stored = profileStorage.getProfile(userId)
    if (stored) {
      set({ profile: stored })
      return
    }

    set({ profile: emptyProfile })
  },

  resetProfile: () => set({ profile: emptyProfile, isEditProfileModalOpen: false }),
}))

export const selectIsEditProfileModalOpen = (state: ProfileStore) => state.isEditProfileModalOpen
export const selectProfileAvatar = (state: ProfileStore) => state.profile.avatar
export const selectProfileFullName = (state: ProfileStore) => state.profile.fullName
