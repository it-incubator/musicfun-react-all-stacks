import { useAddToPlaylist } from "../../../lib/hooks/useAddToPlaylist.ts"
import { useEditTrack } from "../../../lib/hooks/useEditTrack.ts"
import { useRemoveTrack } from "../../../lib/hooks/useRemoveTrack.ts"
import type { TrackDetails, TrackSummaryAttributes } from "../../../api/tracksApi.types.ts"
import { AddTrackToPlaylistModal } from "../AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx"
import { EditTrackForm } from "./EditTrackForm/EditTrackForm.tsx"
import { TrackItem } from "./TrackItem/TrackItem.tsx"
import s from "./TracksList.module.css"

type Props = {
  tracks: TrackDetails<TrackSummaryAttributes>[]
}

export const TracksList = ({ tracks }: Props) => {
  const { removingTrackId, removeTrack } = useRemoveTrack()
  const { modalTrackId, setModalTrackId, addTrackToPlaylist } = useAddToPlaylist()
  const { register, handleSubmit, onSubmit, trackId, editTrackHandler, setPlaylistId, playlistId } = useEditTrack()

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
            <div className={`item item--fullwidth`} key={track.id}>
              {isEditing ? (
                <EditTrackForm
                  onSubmit={onSubmit}
                  editTrack={() => editTrackHandler(null)}
                  handleSubmit={handleSubmit}
                  register={register}
                  playlistId={playlistId}
                  setPlaylistId={setPlaylistId}
                />
              ) : (
                <TrackItem
                  track={track}
                  removeTrack={() => removeTrack(track.id)}
                  removingTrackId={removingTrackId}
                  editTrack={() => editTrackHandler(track)}
                  addTrackToPlaylist={() => setModalTrackId(track.id)}
                />
              )}
            </div>
          )
        })}
      </>
    </div>
  )
}
