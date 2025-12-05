import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiAuthInstance from '@/features/auth/model/api/auth-instanse/auth-instanse'
import { tokenStorage } from '@/shared/storage/tokenStorage'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ code, redirectUri }: { code: string; redirectUri: string }) => {
      const response = await apiAuthInstance.login({
        code,
        redirectUri: redirectUri,
        accessTokenTTL: '10m',
        rememberMe: true,
      })

      return response.data
    },
    onSuccess: async (data) => {
      console.log('data', data)
      await tokenStorage.set({ accessToken: data.accessToken, refreshToken: data.refreshToken })

      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      //   await queryClient.refetchQueries({ queryKey: ['auth','me'], type: 'all' })
    },
  })
}
