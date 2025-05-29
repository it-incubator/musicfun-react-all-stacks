import { EditTrackForm } from "@/features/tracks/ui/TracksPage/TracksList/EditTrackForm/EditTrackForm.tsx"
import { useEditTrack } from "../../../lib/hooks/useEditTrack.ts"
import { TrackActions } from "./TrackItem/TrackActions/TrackActions.tsx"
import { TrackItem } from "./TrackItem/TrackItem.tsx"
import type { FetchTracksAttributes, TrackDetails } from "../../../api/tracksApi.types.ts"
import { useAddToPlaylist } from "../../../lib/hooks/useAddToPlaylist.ts"
import { useRemoveTrack } from "../../../lib/hooks/useRemoveTrack.ts"
import { AddTrackToPlaylistModal } from "../AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx"
import s from "./TracksList.module.css"

type Props = {
  tracks: TrackDetails<FetchTracksAttributes>[]
}

export const TracksList = ({ tracks }: Props) => {
  const { removingTrackId, removeTrack } = useRemoveTrack()
  const { modalTrackId, setModalTrackId, addTrackToPlaylist } = useAddToPlaylist()
  const { register, handleSubmit, onSubmit, trackId, editTrackHandler } = useEditTrack()

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
            <div>
              {isEditing ? (
                <EditTrackForm
                  register={register}
                  onSubmit={onSubmit}
                  handleSubmit={handleSubmit}
                  editTrack={(e) => editTrackHandler(e, null)}
                />
              ) : (
                <TrackItem<FetchTracksAttributes> track={track} key={track.id}>
                  <TrackActions
                    track={track}
                    removeTrack={() => removeTrack(track.id)}
                    removingTrackId={removingTrackId}
                    addTrackToPlaylist={() => setModalTrackId(track.id)}
                    editTrack={(e) => editTrackHandler(e, track)}
                  />
                </TrackItem>
              )}
            </div>
          )
        })}
      </>
    </div>
  )
}
