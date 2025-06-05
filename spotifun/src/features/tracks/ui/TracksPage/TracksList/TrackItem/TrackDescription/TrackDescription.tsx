import type {
  BaseAttributes,
  FetchTracksAttributes,
  PlaylistItemAttributes,
  TrackDetailAttributes,
} from "../../../../../api/tracksApi.types.ts"
import s from "./TrackDescription.module.css"

type Props<T extends BaseAttributes> = {
  attributes: T
}

export const TrackDescription = <T extends BaseAttributes>({ attributes }: Props<T>) => {
  const { title, addedAt } = attributes

  const { order } = attributes as Partial<PlaylistItemAttributes>
  const { user } = attributes as Partial<FetchTracksAttributes>
  const { lyrics, likesCount, tags, artists } = attributes as Partial<TrackDetailAttributes>

  return (
    <div className={s.container}>
      {/* Title  */}
      <div>
        <b>Title:</b> <span>{title}</span>
      </div>

      {/* Added date  */}
      <div>
        <b>Added date:</b> <span>{new Date(addedAt).toLocaleDateString()}</span>
      </div>

      {/* Lyrics  */}
      {!!lyrics && (
        <div>
          <b>Lyrics:</b> <span>{lyrics}</span>
        </div>
      )}

      {/* Tags  */}
      {!!tags?.length && (
        <div>
          <b>Tags:</b>{" "}
          <div className={"tagsList"}>
            {tags.map((t) => {
              return (
                <div key={t.id} className={"tagItem"}>
                  {"#" + " " + t.name}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Artists  */}
      {!!artists?.length && (
        <div>
          <b>Artists:</b> <span>{artists.map((a) => a.name)}</span>
        </div>
      )}

      {/* Likes count  */}
      {likesCount !== undefined && (
        <div>
          <b>Likes count:</b> <span>{likesCount}</span>
        </div>
      )}

      {/* Order  */}
      {order !== undefined && (
        <div>
          <b>Order:</b> <span>{order}</span>
        </div>
      )}

      {/* User  */}
      {!!user && (
        <div>
          <b>User:</b> <span>{user.name}</span>
        </div>
      )}
    </div>
  )
}
