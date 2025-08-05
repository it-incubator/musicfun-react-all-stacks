import type { PlaylistAttributes } from '../../../../../api/playlistsApi.types'
import s from './PlaylistDescription.module.css'

type Props = {
  attributes: PlaylistAttributes
}

export const PlaylistDescription = ({ attributes }: Props) => {
  const { title, description, tags, addedAt, order, user } = attributes

  const tagsContent = tags.length ? tags.map((t) => t.name).join(',') : 'No tags added'

  return (
    <>
      <div className={s.field}>
        <b>title:</b>
        <span className={s.truncatedValue} title={title}>
          {title}
        </span>
      </div>
      <div className={s.field}>
        <b>description:</b>
        <span className={s.truncatedValue} title={description || 'No description added'}>
          {description || 'No description added'}
        </span>
      </div>
      <div className={s.field}>
        <b>order:</b>
        <span>{order}</span>
      </div>
      <div className={s.field}>
        <b>tags:</b>
        <span className={s.truncatedValue} title={tagsContent}>
          {tagsContent}
        </span>
      </div>
      <div className={s.field}>
        <b>added date:</b>
        <span>{new Date(addedAt).toLocaleDateString()}</span>
      </div>
      <div className={s.field}>
        <b>author:</b>
        <span className={s.truncatedValue} title={`name:${user.name} : id- ${user.id}`}>
          name:{user.name} : id- {user.id}
        </span>
      </div>
    </>
  )
}
