import { useQuery } from '@tanstack/react-query'
import { getClient } from '../../../shared/api/client.ts'

export const useMeQuery = () => {
  return useQuery({ queryKey: ['auth', 'me'], queryFn: () => getClient().GET('/auth/me') })
}
