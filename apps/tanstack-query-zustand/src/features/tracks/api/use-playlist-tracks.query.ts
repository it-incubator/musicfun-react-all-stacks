import { useQuery } from '@tanstack/react-query'
import { tracksKeys } from './query-key-factory'
import { getClient } from '@/shared/api/client'

export const usePlaylistTracks = (playlistId: string) => {
  return useQuery({
    queryKey: tracksKeys.playlist(playlistId),
    queryFn: async () => {
      const response = await getClient().GET('/playlists/{playlistId}/tracks', {
        params: { path: { playlistId } },
      })
      return response.data
    },
    enabled: !!playlistId,
  })
}
