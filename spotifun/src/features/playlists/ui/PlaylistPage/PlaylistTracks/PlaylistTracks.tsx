import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router"
import { Path } from "@/common/routing"
import { useRemoveTrackFromPlaylist } from "../../../lib/hooks/useRemoveTrackFromPlaylist.ts"
import { TrackQueryKey, tracksApi } from "../../../../tracks/api/tracksApi.ts"
import type { PlaylistItemAttributes } from "../../../../tracks/api/tracksApi.types.ts"
import { useEditTrack } from "../../../../tracks/lib/hooks/useEditTrack.ts"
import { EditTrackForm } from "../../../../tracks/ui/TracksPage/TracksList/EditTrackForm/EditTrackForm.tsx"
import { TrackItem } from "../../../../tracks/ui/TracksPage/TracksList/TrackItem/TrackItem.tsx"

export const PlaylistTracks = () => {
  const { playlistId } = useParams<{ playlistId?: string }>()

  const { register, handleSubmit, onSubmit, trackId, editTrackHandler } = useEditTrack()
  const { removeTrackFromPlaylist } = useRemoveTrackFromPlaylist(playlistId)

  const { data } = useQuery({
    queryKey: [TrackQueryKey, playlistId],
    queryFn: () => tracksApi.fetchTracksInPlaylist({ playlistId: playlistId as string }),
    enabled: !!playlistId,
  })

  if (!playlistId) {
    return <Navigate to={Path.NotFound} />
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
          <div key={track.id}>
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
                  <button onClick={(e) => removeTrackFromPlaylist(e, track.id)}>Удалить трек из плейлиста</button>
                </div>
              </TrackItem>
            )}
          </div>
        )
      })}
    </>
  )
}
