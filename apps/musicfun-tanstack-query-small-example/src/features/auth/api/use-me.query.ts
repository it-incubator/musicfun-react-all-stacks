import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/shared/api/client.ts'
import { requestWrapper } from '@/shared/api/request-wrapper.ts'

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => requestWrapper(getClient().GET('/auth/me')),
    retry: false,
  })
}
