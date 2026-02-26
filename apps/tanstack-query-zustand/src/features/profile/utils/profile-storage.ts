import type { Profile } from '../types/profile.types'
import { getProfileStorageKey } from './storage-key'

export const profileStorage = {
  getProfile(userId: string): Profile | null {
    const raw = localStorage.getItem(getProfileStorageKey(userId))
    if (!raw) return null

    try {
      return JSON.parse(raw) as Profile
    } catch {
      return null
    }
  },

  saveProfile(userId: string, profile: Profile) {
    localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(profile))
  },
}
