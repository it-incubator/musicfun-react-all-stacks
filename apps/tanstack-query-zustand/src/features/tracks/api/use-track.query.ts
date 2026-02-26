import { useQuery } from '@tanstack/react-query'
import { tracksKeys } from './query-key-factory'
import { getClient } from '@/shared/api/client'

export const useTrack = (trackId: string) => {
  return useQuery({
    queryKey: tracksKeys.detail(trackId),
    queryFn: async () => {
      const response = await getClient().GET('/playlists/tracks/{trackId}', {
        params: { path: { trackId } },
      })
      return response.data
    },
    enabled: !!trackId,
  })
}
