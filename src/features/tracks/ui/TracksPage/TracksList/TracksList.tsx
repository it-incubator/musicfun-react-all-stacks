import { type Nullable, showErrorToast } from "@/common"
import { PlaylistQueryKey, playlistsApi } from "@/features/playlists/api/playlistsApi.ts"
import { queryClient } from "@/main.tsx"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { TrackQueryKey, tracksApi } from "../../../api/tracksApi.ts"
import type { TrackDetails, TrackListItemAttributes, UpdateTrackArgs } from "../../../api/tracksApi.types.ts"
import { EditTrackForm } from "./EditTrackForm/EditTrackForm.tsx"
import { TrackItem } from "./TrackItem/TrackItem.tsx"
import s from "./TracksList.module.css"

type Props = {
  tracks: TrackDetails<TrackListItemAttributes>[]
}

export const TracksList = ({ tracks }: Props) => {
  const [editId, setEditId] = useState<Nullable<string>>(null)
  const [removingTrackId, setRemovingTrackId] = useState<Nullable<string>>(null)

  const [playlistId, setPlaylistId] = useState<Nullable<string>>(null)

  const { data } = useQuery({
    queryKey: [PlaylistQueryKey, "my"],
    queryFn: playlistsApi.fetchMyPlaylists,
  })

  const { register, handleSubmit, reset } = useForm<UpdateTrackArgs>()

  const { mutate: removeTrackMutation } = useMutation({
    mutationFn: tracksApi.removeTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
    },
    onError: (error: unknown) => {
      showErrorToast("Не удалось удалить трек", error)
    },
    onSettled: () => {
      setRemovingTrackId(null)
    },
  })

  const { mutate: updateTrackMutation } = useMutation({
    mutationFn: tracksApi.updateTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      setEditId(null)
    },
    onError: (error: unknown) => {
      showErrorToast("Ошибка при обновлении трека", error)
    },
  })

  const removeTrackHandler = (trackId: string) => {
    if (confirm("Вы уверены, что хотите удалить трек?")) {
      setRemovingTrackId(trackId)
      removeTrackMutation(trackId)
    }
  }

  const editTrackHandler = (track: Nullable<TrackDetails<TrackListItemAttributes>>) => {
    setEditId(track?.id ?? null)

    if (track) {
      const { attributes } = track
      // TODO: как мне подтянуть свойства трека (например lyrics),
      //  чтобы их можно было обновить если в треке не содержится эта информация
      reset({ title: attributes.title })
    }
  }

  const onSubmit: SubmitHandler<UpdateTrackArgs> = (payload) => {
    if (!editId || !playlistId) return
    updateTrackMutation({ trackId: editId, playlistId, payload })
  }

  return (
    <div className={s.container}>
      {tracks.map((track) => {
        const isEditing = editId === track.id

        return (
          <div className={`item item--fullwidth`} key={track.id}>
            {isEditing ? (
              <EditTrackForm
                onSubmit={onSubmit}
                editTrack={() => editTrackHandler(null)}
                handleSubmit={handleSubmit}
                register={register}
                playlists={data?.data.data || []}
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
              />
            ) : (
              <TrackItem
                track={track}
                removeTrack={() => removeTrackHandler(track.id)}
                removingTrackId={removingTrackId}
                editTrack={() => editTrackHandler(track)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
