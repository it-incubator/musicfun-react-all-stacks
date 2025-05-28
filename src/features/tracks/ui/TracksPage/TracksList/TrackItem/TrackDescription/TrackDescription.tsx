import type {
  BaseAttributes,
  FetchTracksAttributes,
  PlaylistItemAttributes,
} from "../../../../../api/tracksApi.types.ts"
import s from "./TrackDescription.module.css"

type Props<T extends BaseAttributes> = {
  attributes: T
}

export const TrackDescription = <T extends BaseAttributes>({ attributes }: Props<T>) => {
  const { title, addedAt } = attributes

  const order = (attributes as Partial<PlaylistItemAttributes>).order
  const user = (attributes as Partial<FetchTracksAttributes>).user

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
      {!!user && (
        <div>
          <b>User:</b> <span>{user.name}</span>
        </div>
      )}
    </div>
  )
}
