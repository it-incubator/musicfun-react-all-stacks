import { type Nullable, showErrorToast } from "@/common"
import { PlaylistQueryKey, playlistsApi } from "@/features/playlists/api/playlistsApi.ts"
import { useRemoveTrack } from "@/features/playlists/lib/hooks/useRemoveTrack.ts"
import { AddTrackToPlaylistModal } from "../AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx"
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
  const [playlistId, setPlaylistId] = useState<Nullable<string>>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTrackId, setModalTrackId] = useState<Nullable<string>>(null)

  const { register, handleSubmit, reset } = useForm<UpdateTrackArgs>()

  const { data } = useQuery({ queryKey: [PlaylistQueryKey, "my"], queryFn: playlistsApi.fetchMyPlaylists })

  const { removingTrackId, removeTrack } = useRemoveTrack()

  const { mutate: updateTrackMutation } = useMutation({
    mutationFn: tracksApi.updateTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      setEditId(null)
    },
    onError: (err: unknown) => showErrorToast("Ошибка при обновлении трека", err),
  })

  const { mutate: addTrackToPlaylistMutation } = useMutation({
    mutationFn: tracksApi.addTrackToPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TrackQueryKey] })
      setIsModalOpen(false)
    },
    onError: (err: unknown) => showErrorToast("Ошибка при добавлении трека в плейлсит", err),
  })

  const editTrackHandler = (track: Nullable<TrackDetails<TrackListItemAttributes>>) => {
    setEditId(track?.id ?? null)

    if (track) {
      const { attributes } = track
      // TODO: как мне подтянуть свойства трека (например lyrics),
      //  чтобы их можно было обновить если в треке не содержится эта информация
      reset({ title: attributes.title })
    }
  }

  const submitAddTrackToPlaylistModal = (trackId: string) => {
    setModalTrackId(trackId)
    setIsModalOpen(true)
  }

  const addTrackToPlaylistHandler = (playlistId: string) => {
    if (!modalTrackId) return
    addTrackToPlaylistMutation({ trackId: modalTrackId, playlistId })
  }

  const onSubmit: SubmitHandler<UpdateTrackArgs> = (payload) => {
    if (!editId || !playlistId) return
    updateTrackMutation({ trackId: editId, playlistId, payload })
  }

  return (
    <div className={s.container}>
      <AddTrackToPlaylistModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTrackToPlaylistHandler}
      />

      <>
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
                  removeTrack={() => removeTrack(track.id)}
                  removingTrackId={removingTrackId}
                  editTrack={() => editTrackHandler(track)}
                  addTrackToPlaylist={() => submitAddTrackToPlaylistModal(track.id)}
                />
              )}
            </div>
          )
        })}
      </>
    </div>
  )
}
