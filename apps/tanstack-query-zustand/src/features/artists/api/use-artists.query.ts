import { useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client.ts'

export type ArtistDto = {
  id: string
  name: string
  image?: string
}

export const useArtists = (search?: string) => {
  return useQuery({
    queryKey: ['artists', search],
    queryFn: () => {
      return getClient().GET('/artists/search', {
        params: {
          query: {
            search: search || '',
          },
        },
      })
    },
    select: (response): ArtistDto[] => {
      return (
        response.data?.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })) || []
      )
    },
    enabled: true,
  })
}
