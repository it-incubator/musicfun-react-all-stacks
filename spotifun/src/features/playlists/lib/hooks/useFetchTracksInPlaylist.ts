import { useQuery } from "@tanstack/react-query"
import { TrackQueryKey, tracksApi } from "../../../tracks/api/tracksApi.ts"

export const useFetchTracksInPlaylist = (playlistId?: string) => {
  const { data } = useQuery({
    queryKey: [TrackQueryKey, playlistId],
    queryFn: () => tracksApi.fetchTracksInPlaylist({ playlistId: playlistId as string }),
    enabled: !!playlistId,
  })

  const tracks = data?.data.data ?? []

  return { tracks }
}
