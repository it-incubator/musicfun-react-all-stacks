import type { Nullable } from "@/common"
import type { TrackDetails, BaseAttributes } from "../../../../api/tracksApi.types.ts"
import { TrackActions } from "./TrackActions/TrackActions.tsx"
import { TrackCover } from "./TrackCover/TrackCover.tsx"
import { TrackDescription } from "./TrackDescription/TrackDescription.tsx"

type Props = {
  track: TrackDetails<BaseAttributes>
  removeTrack: () => void
  removingTrackId: Nullable<string>
  editTrack: () => void
  addTrackToPlaylist: () => void
}

export const TrackItem = ({ track, removeTrack, removingTrackId, editTrack, addTrackToPlaylist }: Props) => {
  return (
    <div className={"flex-container"}>
      <div className={"flex-container"}>
        <TrackCover<BaseAttributes> track={track} />
        <TrackDescription attributes={track.attributes} />
      </div>
      <TrackActions
        track={track}
        removeTrack={removeTrack}
        removingTrackId={removingTrackId}
        editTrack={editTrack}
        addTrackToPlaylist={addTrackToPlaylist}
      />
      {track.attributes.attachments.length && <audio controls src={track.attributes.attachments[0].url}></audio>}
      {!track.attributes.attachments.length && <span>no file</span>}
    </div>
  )
}
