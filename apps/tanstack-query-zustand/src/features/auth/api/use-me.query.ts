import { useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'
import { unwrap } from '@/shared/api/utils/unwrap.ts'
import { authStorage } from '@/shared/utils/authStorage.ts'

export const useMeQuery = () => {
  const hasAtLeastOneToken = !!authStorage.getRefreshToken() || !!authStorage.getAccessToken()

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => unwrap(getClient().GET('/auth/me')),
    enabled: hasAtLeastOneToken,
    retry: false,
  })
}
