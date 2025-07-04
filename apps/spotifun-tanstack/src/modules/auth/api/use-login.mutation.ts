import { authKey } from '@/common/apiEntities'
import { localStorageKeys, type LoginRequestPayload } from './authApi.types.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getClient } from '@/common/api/client.ts'

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
      await qc.invalidateQueries({ queryKey: [authKey] })

      await qc.invalidateQueries()
    },
  })
}
