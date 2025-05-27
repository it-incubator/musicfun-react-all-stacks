import { TrackQueryKey, tracksApi } from "@/features/tracks/api/tracksApi.ts"
import type { PlaylistItemAttributes } from "@/features/tracks/api/tracksApi.types.ts"
import { TrackCover } from "@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackCover/TrackCover.tsx"
import { TrackDescription } from "@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackDescription/TrackDescription.tsx"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

export const PlaylistTracks = () => {
  const { id } = useParams<string>()

  const { data } = useQuery({
    queryKey: [TrackQueryKey],
    queryFn: () => tracksApi.fetchTracksInPlaylist({ playlistId: id ?? "" }),
    enabled: !!id,
  })

  return (
    <div>
      <h2>Треки</h2>
      {data?.data.data.map((track) => {
        return (
          <div key={track.id} className={`item item--fullwidth flex-container`}>
            <div className={"flex-container"}>
              <TrackCover<PlaylistItemAttributes> track={track} />
              <TrackDescription attributes={track.attributes} />
            </div>
            <button>Удалить трек из плейлиста</button>
          </div>
        )
      })}
    </div>
  )
}
