import type { ReactNode } from "react"
import type { BaseAttributes, TrackDetails } from "../../../../api/tracksApi.types.ts"
import { Player } from "./Player/Player.tsx"
import { TrackCover } from "./TrackCover/TrackCover.tsx"
import { TrackDescription } from "./TrackDescription/TrackDescription.tsx"

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
  children: ReactNode
}

export const TrackItem = <T extends BaseAttributes>({ children, track }: Props<T>) => {
  return (
    <div className={`item item--fullwidth flex-container`}>
      <div className={"flex-container"}>
        <TrackCover track={track} />
        <TrackDescription attributes={track.attributes} />
      </div>
      <Player track={track} />
      {children}
    </div>
  )
}
