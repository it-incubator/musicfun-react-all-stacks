import { useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'
import { unwrap } from '@/shared/api/utils/unwrap.ts'

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => unwrap(getClient().GET('/auth/me')),
  })
}
