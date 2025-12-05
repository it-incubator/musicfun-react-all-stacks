import { useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'

export const useTags = (search?: string) => {
  return useQuery({
    queryKey: ['tags', search],
    queryFn: () => {
      return getClient().GET('/tags/search', {
        params: {
          query: {
            search: search || '',
          },
        },
      })
    },
    enabled: true,
  })
}
