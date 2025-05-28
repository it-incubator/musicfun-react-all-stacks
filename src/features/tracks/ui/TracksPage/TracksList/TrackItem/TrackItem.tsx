import { Path } from "@/common/routing"
import type { ReactNode } from "react"
import { Link } from "react-router"
import type { BaseAttributes, TrackDetails } from "../../../../api/tracksApi.types.ts"
import { Player } from "./Player/Player.tsx"
import { TrackCover } from "./TrackCover/TrackCover.tsx"
import { TrackDescription } from "./TrackDescription/TrackDescription.tsx"
import s from "./TrackItem.module.css"

type Props<T extends BaseAttributes> = {
  track: TrackDetails<T>
  children?: ReactNode
}

export const TrackItem = <T extends BaseAttributes>({ children, track }: Props<T>) => {
  return (
    <Link to={`${Path.Tracks}/${track.id}`} className={s.link}>
      <div className={`item item--fullwidth flex-container`}>
        <div className={"flex-container"}>
          <TrackCover track={track} />
          <TrackDescription attributes={track.attributes} />
          <Player track={track} />
        </div>
        {children}
      </div>
    </Link>
  )
}
