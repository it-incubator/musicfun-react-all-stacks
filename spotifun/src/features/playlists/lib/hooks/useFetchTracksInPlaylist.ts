import { tracksKey } from "@/common/apiEntities"
import { useQuery } from "@tanstack/react-query"
import { tracksApi } from "../../../tracks/api/tracksApi.ts"

export const useFetchTracksInPlaylist = (playlistId?: string) => {
  const { data } = useQuery({
    queryKey: [tracksKey, playlistId],
    queryFn: () => tracksApi.fetchTracksInPlaylist({ playlistId: playlistId as string }),
    enabled: !!playlistId,
  })

  const initialTracks = data?.data.data ?? []

  return { initialTracks }
}
