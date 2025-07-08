import { Link } from 'react-router'

import { Tag } from '@/shared/components'

import s from './TagsList.module.css'

export const TagsList = ({
  tags,
  entity = 'tracks',
}: {
  tags: string[]
  entity?: 'tracks' | 'playlists'
}) => {
  return (
    <ul className={s.list}>
      {tags.map((tag) => (
        <li key={tag}>
          <Tag as={Link} to={`/${entity}?tag=${tag}`} tag={tag} />
        </li>
      ))}
    </ul>
  )
}
