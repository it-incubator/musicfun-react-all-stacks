import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getClient, getClientConfig } from '@/shared/api/client.ts'

import { type LoginRequestPayload } from '../types/auth-api.types'

export const useLoginMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginRequestPayload) =>
      getClient().POST('/auth/login', {
        body: payload,
      }),

    onSuccess: async (data) => {
      const cfg = getClientConfig()

      await cfg.saveAccessToken?.(data.data!.accessToken)
      await cfg.saveRefreshToken?.(data.data!.refreshToken)

      await qc.invalidateQueries()
    },
  })
}
