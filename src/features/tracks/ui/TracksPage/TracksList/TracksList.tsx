import type { TrackDetails, TrackListItemAttributes } from "@/features/tracks/api/tracksApi.types.ts"
import s from "./TracksList.module.css"

type Props = {
  tracks: TrackDetails<TrackListItemAttributes>[]
}

export const TracksList = ({ tracks }: Props) => {
  return (
    <div className={s.container}>
      {tracks.map((track) => {
        const { title, addedAt } = track.attributes

        return (
          <div className={"item"} key={track.id}>
            <div>
              <b>title:</b> <span>{title}</span>
            </div>
            <div>
              <b>added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
