import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiAuthInstance from '@/features/auth/model/api/auth-instanse/auth-instanse'
import { tokenStorage } from '@/shared/storage/tokenStorage'

import { REDIRECT_URI_EXPO } from '@/features/auth/model/config/oauth'

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      const refreshToken = await tokenStorage.getRefresh()
      if (!refreshToken) return null

      const response = await apiAuthInstance.logout({
        refreshToken,
        rememberMe: true,
        accessTokenTTL: '1d',
        redirectUri: REDIRECT_URI_EXPO,
      })

      return response.data
    },
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: ['auth', 'me'] })
    },
  })

  return mutation
}
