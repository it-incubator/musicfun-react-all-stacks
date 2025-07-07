import { authKey } from '@/common/apiEntities'
import { localStorageKeys } from './authApi.types.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getClient } from '@/common/api/client.ts'

export const useLogoutMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => {
      return getClient().POST('/auth/logout', {
        body: {
          refreshToken: localStorage.getItem(localStorageKeys.refreshToken)!,
        },
      })
    },
    onSuccess: async () => {
      localStorage.removeItem(localStorageKeys.accessToken)
      localStorage.removeItem(localStorageKeys.refreshToken)
      qc.resetQueries({ queryKey: [authKey] }) // resetQueries переводит query в изначальное состояние и уведомляет подписчиков — компонент получит data = undefined.
      //qc.invalidateQueries({ queryKey: [authKey] }) // invalidateQueries заставит его немедленно перефетчиться без токена ⇒ получите 401 ⇒ data станет undefined / error.
    },
  })
}
