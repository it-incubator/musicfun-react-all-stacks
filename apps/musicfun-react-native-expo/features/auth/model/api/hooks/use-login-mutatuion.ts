import { useMutation, useQueryClient } from '@tanstack/react-query'

import apiAuthInstance from '@/features/auth/model/api/auth-instanse/auth-instanse'

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

      console.log('response', response)

      return response.data
    },
    onSuccess: async (data) => {
      console.log('data', data)
      localStorage.setItem('musicfun-refresh-token', data?.refreshToken || '')
      localStorage.setItem('musicfun-access-token', data?.accessToken || '')
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}
