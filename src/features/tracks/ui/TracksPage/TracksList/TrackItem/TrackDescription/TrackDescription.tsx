import type { TrackListItemAttributes } from "../../../../../api/tracksApi.types.ts"
import s from "./TrackDescription.module.css"

type Props = {
  attributes: TrackListItemAttributes
}

export const TrackDescription = ({ attributes }: Props) => {
  const { title, addedAt } = attributes
  return (
    <div className={s.container}>
      <div>
        <b>title:</b> <span>{title}</span>
      </div>
      <div>
        <b>added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
