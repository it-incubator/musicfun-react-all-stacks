import { useQuery } from '@tanstack/react-query'
import { playlistsKeys } from './query-key-factory'
import { getClient } from '@/shared/api/client'

export const usePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: playlistsKeys.detail(playlistId),
    queryFn: async () => {
      const response = await getClient().GET('/playlists/{playlistId}', {
        params: { path: { playlistId } },
      })
      return response.data
    },
    enabled: !!playlistId,
  })
}
