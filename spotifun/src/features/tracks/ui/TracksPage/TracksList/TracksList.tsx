import { EditTrackForm } from "@/features/tracks/ui/TracksPage/TracksList/EditTrackForm/EditTrackForm.tsx"
import type { FetchTracksAttributes, TrackDetails } from "../../../api/tracksApi.types.ts"
import { useAddToPlaylist } from "../../../lib/hooks/useAddToPlaylist.ts"
import { useEditTrack } from "../../../lib/hooks/useEditTrack.ts"
import { useRemoveTrack } from "../../../lib/hooks/useRemoveTrack.ts"
import { AddTrackToPlaylistModal } from "../AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx"
import { TrackItem } from "./TrackItem/TrackItem.tsx"
import s from "./TracksList.module.css"

type Props = {
  tracks: TrackDetails<FetchTracksAttributes>[]
}

export const TracksList = ({ tracks }: Props) => {
  const { removingTrackId, removeTrack } = useRemoveTrack()
  const { modalTrackId, setModalTrackId, addTrackToPlaylist, openModal } = useAddToPlaylist()
  const { register, handleSubmit, onSubmit, trackId, editTrack, selectedTags, setSelectedTags } = useEditTrack()

  return (
    <div className={s.container}>
      <AddTrackToPlaylistModal
        open={!!modalTrackId}
        onClose={() => setModalTrackId(null)}
        onSave={addTrackToPlaylist}
      />
      <>
        {tracks.map((track) => {
          const isEditing = trackId === track.id

          return (
            <div key={track.id}>
              {isEditing ? (
                <EditTrackForm
                  register={register}
                  onSubmit={onSubmit}
                  handleSubmit={handleSubmit}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  editTrack={(e) => editTrack(e, null)}
                />
              ) : (
                <TrackItem<FetchTracksAttributes> track={track}>
                  <div>
                    <button onClick={(e) => openModal(e, track.id)}>Добавить трек в плейлист</button>
                    <button onClick={(e) => editTrack(e, track.id)}>Редактировать</button>
                    <button onClick={(e) => removeTrack(e, track.id)} disabled={removingTrackId === track.id}>
                      {removingTrackId === track.id ? "Удаление..." : "Удалить"}
                    </button>
                  </div>
                </TrackItem>
              )}
            </div>
          )
        })}
      </>
    </div>
  )
}
