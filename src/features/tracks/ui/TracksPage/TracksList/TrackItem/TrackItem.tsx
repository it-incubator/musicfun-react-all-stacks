import type { Nullable } from "@/common"
import { TrackActions } from "./TrackActions/TrackActions.tsx"
import { TrackCover } from "./TrackCover/TrackCover.tsx"
import { TrackDescription } from "./TrackDescription/TrackDescription.tsx"
import type { TrackDetails, TrackListItemAttributes } from "../../../../api/tracksApi.types.ts"
import s from "./TrackItem.module.css"

type Props = {
  track: TrackDetails<TrackListItemAttributes>
  removeTrack: (trackId: string) => void
  removingTrackId: Nullable<string>
}

export const TrackItem = ({ track, removeTrack, removingTrackId }: Props) => {
  return (
    <div className={`item item--fullwidth ${s.container}`}>
      <div className={s.container}>
        <TrackCover track={track} />
        <TrackDescription attributes={track.attributes} />
      </div>
      <TrackActions track={track} removeTrack={removeTrack} removingTrackId={removingTrackId} />
    </div>
  )
}
