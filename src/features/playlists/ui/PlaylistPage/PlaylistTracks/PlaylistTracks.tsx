import type { MouseEvent } from "react"
import { Path } from "@/common"
import { TrackQueryKey, tracksApi } from "@/features/tracks/api/tracksApi.ts"
import { TrackItem } from "../../../../tracks/ui/TracksPage/TracksList/TrackItem/TrackItem.tsx"
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

  const removeTrackFromPlaylistHandler = (e: MouseEvent, trackId: string) => {
    e.preventDefault()
    if (confirm("Вы уверены, что хотите удалить трек из плейлиста?")) {
      mutate({ playlistId, trackId })
    }
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
          <TrackItem track={track} key={track.id}>
            <button onClick={(e) => removeTrackFromPlaylistHandler(e, track.id)}>Удалить трек из плейлиста</button>
          </TrackItem>
        )
      })}
    </>
  )
}
