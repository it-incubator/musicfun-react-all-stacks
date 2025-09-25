import { useQuery } from '@tanstack/react-query'
import { client } from '../../../shared/api/client.ts'
import { authKeys } from '../../../shared/api/keys-factories/auth-keys-factory.ts'

export const useMeQuery = () =>
  useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const clientResponse = await client.GET('/auth/me')
      return clientResponse.data
    },
    retry: false,
  })
