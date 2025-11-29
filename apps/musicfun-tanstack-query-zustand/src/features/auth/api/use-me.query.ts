import { useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'
import { unwrap } from '@/shared/api/utils/unwrap.ts'

interface UseMeQueryOptions {
  enabled?: boolean
}
export const useMeQuery = (opts?: UseMeQueryOptions) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => unwrap(getClient().GET('/auth/me')),
    enabled: opts?.enabled ?? true,
  })
}
