import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'

export const usePlaylists = ({
  search,
  pageNumber,
  userId,
}: {
  search?: string
  pageNumber: number
  userId?: string
}) => {
  const query = useQuery({
    queryKey: ['playlists', { search, pageNumber, userId }],
    queryFn: () => {
      return getClient().GET('/playlists', {
        params: {
          query: {
            search: search && undefined,
            pageNumber,
            pageSize: 5,
            userId,
          },
        },
      })
    },
    placeholderData: keepPreviousData,
  })

  return query
}
