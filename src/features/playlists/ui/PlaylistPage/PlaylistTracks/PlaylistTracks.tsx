import { Path } from "@/common"
import { TrackQueryKey, tracksApi } from "@/features/tracks/api/tracksApi.ts"
import type { PlaylistItemAttributes } from "@/features/tracks/api/tracksApi.types.ts"
import { TrackCover } from "@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackCover/TrackCover.tsx"
import { TrackDescription } from "@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackDescription/TrackDescription.tsx"
import { queryClient } from "@/main.tsx"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"

export const PlaylistTracks = () => {
  const { id: playlistId } = useParams<{ id: string }>()

  if (!playlistId) {
    return <Navigate to={Path.NotFound} />
  }

  const { data } = useQuery({
    queryKey: [TrackQueryKey],
    queryFn: () => tracksApi.fetchTracksInPlaylist({ playlistId }),
  })

  const { mutate } = useMutation({
    mutationFn: tracksApi.removeTrackFromPlaylist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TrackQueryKey] }),
  })

  const removeTrackFromPlaylistHandler = (trackId: string) => {
    mutate({ playlistId, trackId })
  }

  const tracks = data?.data.data ?? []

  if (tracks.length === 0) {
    return <h2>В данном плейлисте треков нет 😢</h2>
  }

  return (
    <>
      <h2>Треки</h2>
      {tracks.map((track) => {
        return (
          <div key={track.id} className={`item item--fullwidth flex-container`}>
            <div className={"flex-container"}>
              <TrackCover<PlaylistItemAttributes> track={track} />
              <TrackDescription attributes={track.attributes} />
            </div>
            <button onClick={() => removeTrackFromPlaylistHandler(track.id)}>Удалить трек из плейлиста</button>
          </div>
        )
      })}
    </>
  )
}
