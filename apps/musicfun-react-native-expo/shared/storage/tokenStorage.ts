import * as SecureStore from 'expo-secure-store'
import { KEY_STORAGE } from '@/shared/consts/key-storage/key-storage'

export type Tokens = { accessToken: string; refreshToken: string }

export const tokenStorage = {
  set: async ({ accessToken, refreshToken }: Tokens) => {
    await Promise.all([
      SecureStore.setItemAsync(KEY_STORAGE.ACCESS_TOKEN, accessToken, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      }),
      SecureStore.setItemAsync(KEY_STORAGE.REFRESH_TOKEN, refreshToken, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      }),
    ])
  },
  getAccess: () => SecureStore.getItemAsync(KEY_STORAGE.ACCESS_TOKEN),
  getRefresh: () => SecureStore.getItemAsync(KEY_STORAGE.REFRESH_TOKEN),
  clear: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(KEY_STORAGE.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEY_STORAGE.REFRESH_TOKEN),
    ])
  },
}
