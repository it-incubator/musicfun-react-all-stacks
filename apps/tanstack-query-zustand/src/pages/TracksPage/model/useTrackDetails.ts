import { useQuery } from '@tanstack/react-query'

import { getClient } from '@/shared/api/client'
import { unwrap } from '@/shared/api/utils/unwrap'

export function useTrackDetails(trackId: string) {
  return useQuery({
    queryFn: () =>
      unwrap(
        getClient().GET('/playlists/tracks/{trackId}', {
          params: {
            path: { trackId },
          },
        })
      ),
    queryKey: ['tracks', 'details', trackId],
  })
}
