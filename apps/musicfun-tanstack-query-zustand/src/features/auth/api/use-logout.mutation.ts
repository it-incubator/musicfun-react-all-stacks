import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'
import { unwrap } from '@/shared/api/utils/unwrap.ts'

import { localStorageKeys } from '../types/auth-api.types'

export const useLogoutMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => {
      return unwrap(
        getClient().POST('/auth/logout', {
          body: {
            refreshToken: localStorage.getItem(localStorageKeys.refreshToken)!,
          },
        })
      )
    },
    onSuccess: async () => {
      localStorage.removeItem(localStorageKeys.accessToken)
      localStorage.removeItem(localStorageKeys.refreshToken)
      await qc.resetQueries({ queryKey: ['auth', 'me'] }) // resetQueries переводит query в изначальное состояние и уведомляет подписчиков — компонент получит data = undefined.
      //await qc.invalidateQueries({ queryKey: ['auth', 'me'] }) // invalidateQueries заставит его немедленно перефетчиться без токена ⇒ получите 401 ⇒ data станет undefined / error.
    },
  })
}
