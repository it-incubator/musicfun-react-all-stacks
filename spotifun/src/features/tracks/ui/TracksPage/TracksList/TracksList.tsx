import { TrackActions } from "@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackActions/TrackActions.tsx"
import { TrackItem } from "@/features/tracks/ui/TracksPage/TracksList/TrackItem/TrackItem.tsx"
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

  return (
    <div className={s.container}>
      <AddTrackToPlaylistModal
        open={!!modalTrackId}
        onClose={() => setModalTrackId(null)}
        onSave={addTrackToPlaylist}
      />

      <>
        {tracks.map((track) => {
          return (
            <TrackItem<FetchTracksAttributes> track={track} key={track.id}>
              <TrackActions
                track={track}
                removeTrack={() => removeTrack(track.id)}
                removingTrackId={removingTrackId}
                addTrackToPlaylist={() => setModalTrackId(track.id)}
              />
            </TrackItem>
          )
        })}
      </>
    </div>
  )
}
