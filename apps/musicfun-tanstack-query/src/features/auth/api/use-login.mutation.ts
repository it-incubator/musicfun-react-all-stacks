import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'

import { localStorageKeys, type LoginRequestPayload } from '../types/auth-api.types'

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
      await qc.invalidateQueries({ queryKey: ['auth', 'me'] })

      await qc.invalidateQueries()
    },
  })
}
