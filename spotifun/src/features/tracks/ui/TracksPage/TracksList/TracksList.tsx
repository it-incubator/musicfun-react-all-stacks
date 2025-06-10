import { tracksKey } from "@/common/apiEntities"
import { tracksApi } from "@/features/tracks/api/tracksApi.ts"
import { useQuery } from "@tanstack/react-query"
import type { FetchTracksAttributes } from "../../../api/tracksApi.types.ts"
import { useAddToPlaylist } from "../../../lib/hooks/useAddToPlaylist.ts"
import { useEditTrack } from "../../../lib/hooks/useEditTrack.ts"
import { useRemoveTrack } from "../../../lib/hooks/useRemoveTrack.ts"
import { AddTrackToPlaylistModal } from "../AddTrackToPlaylistModal/AddTrackToPlaylistModal.tsx"
import { EditTrackForm } from "./EditTrackForm/EditTrackForm.tsx"
import { TrackItem } from "./TrackItem/TrackItem.tsx"
import s from "./TracksList.module.css"

export const TracksList = () => {
  const { data } = useQuery({ queryKey: [tracksKey], queryFn: tracksApi.fetchTracks })
  const { removingTrackId, removeTrack } = useRemoveTrack()
  const { modalTrackId, setModalTrackId, addTrackToPlaylist, openModal } = useAddToPlaylist()
  const { register, handleSubmit, onSubmit, trackId, editTrack, tagIds, setTagIds, artistsIds, setArtistsIds } =
    useEditTrack()

  return (
    <div className={s.container}>
      <AddTrackToPlaylistModal
        open={!!modalTrackId}
        onClose={() => setModalTrackId(null)}
        onSave={addTrackToPlaylist}
      />
      <>
        {data?.data.data.map((track) => {
          const isEditing = trackId === track.id

          return (
            <div key={track.id}>
              {isEditing ? (
                <EditTrackForm
                  register={register}
                  onSubmit={onSubmit}
                  handleSubmit={handleSubmit}
                  tagIds={tagIds}
                  setTagIds={setTagIds}
                  artistsIds={artistsIds}
                  setArtistsIds={setArtistsIds}
                  editTrack={(e) => editTrack(e, null)}
                />
              ) : (
                <TrackItem<FetchTracksAttributes> track={track}>
                  <div className={"trackActions"}>
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
