import type { TrackListItemAttributes } from "../../../../../api/tracksApi.types.ts"

type Props = {
  attributes: TrackListItemAttributes
}

export const TrackDescription = ({ attributes }: Props) => {
  const { title, addedAt } = attributes
  return (
    <>
      <div>
        <b>title:</b> <span>{title}</span>
      </div>
      <div>
        <b>added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
      </div>
    </>
  )
}
