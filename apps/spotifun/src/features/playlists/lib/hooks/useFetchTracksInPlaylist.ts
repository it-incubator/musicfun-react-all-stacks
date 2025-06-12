import { tracksKey } from "@/common/apiEntities"
import { tracksApi } from "@it-incubator/spotifun-api-sdk"
import { useQuery } from "@tanstack/react-query"

export const useFetchTracksInPlaylist = (playlistId?: string) => {
  const { data } = useQuery({
    queryKey: [tracksKey, playlistId],
    queryFn: () => tracksApi.fetchTracksInPlaylist({ playlistId: playlistId as string }),
    enabled: !!playlistId,
  })

  const initialTracks = data?.data.data ?? []

  return { initialTracks }
}
