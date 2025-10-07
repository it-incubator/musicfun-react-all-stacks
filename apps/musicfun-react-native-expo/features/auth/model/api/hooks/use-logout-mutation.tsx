import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiAuthInstance from '@/features/auth/model/api/auth-instanse/auth-instanse'
import { tokenStorage } from '@/shared/storage/tokenStorage'
import { redirectUriExpo } from '@/features/auth/components/LoginButton/LoginButton'

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      const refreshToken = await tokenStorage.getRefresh()
      if (!refreshToken) throw new Error('Refresh токен не найден')

      const response = await apiAuthInstance.logout({
        refreshToken,
        rememberMe: true,
        accessTokenTTL: '1d',
        redirectUri: redirectUriExpo,
      })

      return response.data
    },
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: ['auth', 'me'] })
    },
  })

  return mutation
}
