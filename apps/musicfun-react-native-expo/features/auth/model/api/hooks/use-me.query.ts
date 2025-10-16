import { useQuery } from '@tanstack/react-query'
import apiAuthInstance from '@/features/auth/model/api/auth-instanse/auth-instanse'

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await apiAuthInstance.me()
      return res.data
    },
  })
}
