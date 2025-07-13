import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { LoginRequestPayload } from './auth-api.types.ts'
import { getClient } from '../../../shared/api/client.ts'
import { localStorageKeys } from '../../../shared/db/localstorage-keys.ts'

export const useLoginMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: LoginRequestPayload) => {
      return getClient().POST('/auth/login', {
        body: payload,
      })
    },
    onSuccess: async (data) => {
      localStorage.setItem(localStorageKeys.refreshToken, data.data!.refreshToken)
      localStorage.setItem(localStorageKeys.accessToken, data.data!.accessToken)
      await qc.invalidateQueries({ queryKey: ['auth'] })

      await qc.invalidateQueries()
    },
  })
}
