import { authKey } from '@/common/apiEntities'
import { useQuery } from '@tanstack/react-query'
import { getClient } from '@/common/api/client.ts'

export const useMeQuery = () => {
  return useQuery({ queryKey: [authKey], queryFn: () => getClient().GET('/auth/me') })
}
