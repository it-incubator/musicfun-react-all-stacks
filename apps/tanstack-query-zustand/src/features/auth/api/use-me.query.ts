import { useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'
import { unwrap } from '@/shared/api/utils/unwrap.ts'
import { authStorage } from '@/shared/utils/authStorage.ts'

export const useMeQuery = () => {
  // This optimization is nice — it prevents the request when we know for sure
  // that the user is not authenticated because there are no tokens in storage.
  // But it breaks the login flow: after login, tokens appear in storage,
  // yet this hook doesn't know about it, so enabled stays false.
  // We either drop this optimization or come up with an elegant solution.
  // const hasAtLeastOneToken = !!authStorage.getRefreshToken() || !!authStorage.getAccessToken()

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => unwrap(getClient().GET('/auth/me')),
    // enabled: hasAtLeastOneToken,
    retry: false,
  })
}
