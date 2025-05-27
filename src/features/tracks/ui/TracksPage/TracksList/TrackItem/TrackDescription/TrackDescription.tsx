import type { BaseAttributes } from "../../../../../api/tracksApi.types.ts"
import s from "./TrackDescription.module.css"

type Props = {
  attributes: BaseAttributes & Partial<{ order: number }>
}

export const TrackDescription = ({ attributes }: Props) => {
  const { title, addedAt, order } = attributes

  return (
    <div className={s.container}>
      <div>
        <b>Title:</b> <span>{title}</span>
      </div>
      <div>
        <b>Added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
      </div>
      {order !== undefined && (
        <div>
          <b>Order:</b> <span>{order}</span>
        </div>
      )}
    </div>
  )
}
