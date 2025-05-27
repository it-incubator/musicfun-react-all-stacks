import type { Nullable } from "@/common"
import { Player } from "./Player/Player.tsx"
import type { BaseAttributes, TrackDetails } from "../../../../api/tracksApi.types.ts"
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
        <TrackCover track={track} />
        <TrackDescription attributes={track.attributes} />
      </div>
      <Player track={track} />
      <TrackActions
        track={track}
        removeTrack={removeTrack}
        removingTrackId={removingTrackId}
        editTrack={editTrack}
        addTrackToPlaylist={addTrackToPlaylist}
      />
    </div>
  )
}
