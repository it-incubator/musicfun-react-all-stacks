import type { PlaylistItemAttributes } from "@/features/tracks/api/tracksApi.types.ts"
import { useEditTrack } from "../../../../tracks/lib/hooks/useEditTrack.ts"
import { EditTrackForm } from "../../../../tracks/ui/TracksPage/TracksList/EditTrackForm/EditTrackForm.tsx"
import type { MouseEvent } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"
import { Path } from "@/common/routing"
import { queryClient } from "@/main.tsx"
import { TrackQueryKey, tracksApi } from "@/features/tracks/api/tracksApi.ts"
import { TrackItem } from "../../../../tracks/ui/TracksPage/TracksList/TrackItem/TrackItem.tsx"

export const PlaylistTracks = () => {
  const { playlistId } = useParams<{ playlistId: string }>()

  if (!playlistId) {
    return <Navigate to={Path.NotFound} />
  }

  const { register, handleSubmit, onSubmit, trackId, editTrackHandler } = useEditTrack()

  const { data } = useQuery({
    queryKey: [TrackQueryKey, playlistId],
    queryFn: () => tracksApi.fetchTracksInPlaylist({ playlistId }),
  })

  const { mutate } = useMutation({
    mutationFn: tracksApi.removeTrackFromPlaylist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TrackQueryKey, playlistId] }),
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
        const isEditing = trackId === track.id

        return (
          <div>
            {isEditing ? (
              <EditTrackForm
                register={register}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                editTrack={(e) => editTrackHandler(e, null)}
              />
            ) : (
              <TrackItem<PlaylistItemAttributes> track={track}>
                <div>
                  <button onClick={(e) => editTrackHandler(e, track)}>Редактировать</button>
                  <button onClick={(e) => removeTrackFromPlaylistHandler(e, track.id)}>
                    Удалить трек из плейлиста
                  </button>
                </div>
              </TrackItem>
            )}
          </div>
        )
      })}
    </>
  )
}
