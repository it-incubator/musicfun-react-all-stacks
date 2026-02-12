import { useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'

import type { TagDto } from './tags-api'

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
    select: (response): TagDto[] => {
      return (
        response.data?.data?.map((tag) => ({
          id: tag.id,
          name: tag.attributes.name,
        })) || []
      )
    },
    enabled: true,
  })
}
