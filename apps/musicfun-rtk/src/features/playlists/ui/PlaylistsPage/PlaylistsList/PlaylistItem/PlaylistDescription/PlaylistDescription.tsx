import type { PlaylistAttributes } from '../../../../../api/playlistsApi.types'
import s from './PlaylistDescription.module.css'

type Props = {
  attributes: PlaylistAttributes
}

export const PlaylistDescription = ({ attributes }: Props) => {
  const { title, description, tags, addedAt, order, user } = attributes

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
        <span className={s.truncatedValue} title={description || 'Описание не добавлено'}>
          {description || 'Описание не добавлено'}
        </span>
      </div>
      <div className={s.field}>
        <b>order:</b>
        <span>{order}</span>
      </div>
      <div className={s.field}>
        <b>tags:</b>
        <span className={s.truncatedValue} title={tags.length ? tags.join(', ') : 'Теги не добавлены'}>
          {tags.length ? tags.map((t) => t.name + ' ') : 'Теги не добавлены'}
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
