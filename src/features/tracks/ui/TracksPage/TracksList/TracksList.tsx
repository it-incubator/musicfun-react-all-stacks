import { type Nullable, showErrorToast } from "@/common"
import { Modal } from "@/common/components/Modal/Modal.tsx"
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTrackId, setModalTrackId] = useState<Nullable<string>>(null)

  const { register, handleSubmit, reset } = useForm<UpdateTrackArgs>()

  const { data } = useQuery({
    queryKey: [PlaylistQueryKey, "my"],
    queryFn: playlistsApi.fetchMyPlaylists,
  })

  const { mutate: removeTrackMutation } = useMutation({
    mutationFn: tracksApi.removeTrack,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TrackQueryKey] }),
    onError: (err: unknown) => showErrorToast("Не удалось удалить трек", err),
    onSettled: () => setRemovingTrackId(null),
  })

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

  const addTrackToPlaylistHandler = (trackId: string) => {
    setModalTrackId(trackId)
    setIsModalOpen(true)
  }

  const handleSavePlaylist = () => {
    if (!playlistId || !modalTrackId) return
    addTrackToPlaylistMutation({ trackId: modalTrackId, playlistId })
  }

  const onSubmit: SubmitHandler<UpdateTrackArgs> = (payload) => {
    if (!editId || !playlistId) return
    updateTrackMutation({ trackId: editId, playlistId, payload })
  }

  return (
    <div className={s.container}>
      {/*AddTrackToPlaylistModal*/}
      <Modal modalTitle={"Добавить трек в плейлист"} open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <label>
          Выберите плейлист:
          <select onChange={(e) => setPlaylistId(e.target.value)} value={playlistId ?? ""}>
            <option value="" disabled>
              -- Выберите плейлист --
            </option>
            {data?.data.data.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.attributes.title}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSavePlaylist}>Сохранить</button>
        <button onClick={() => setIsModalOpen(false)}>Отмена</button>
      </Modal>

      {/*Tracks*/}
      <div>
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
                  addTrackToPlaylist={() => addTrackToPlaylistHandler(track.id)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
