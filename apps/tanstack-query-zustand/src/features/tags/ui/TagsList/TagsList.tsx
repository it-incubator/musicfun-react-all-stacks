import { Link } from 'react-router'

import type { TagDto } from '@/features/tags/api/tags-api'
import { Tag } from '@/shared/components'

import s from './TagsList.module.css'

export const TagsList = ({
  tags,
  entity = 'tracks',
}: {
  tags: TagDto[]
  entity?: 'tracks' | 'playlists'
}) => {
  return (
    <ul className={s.list}>
      {tags.map((tag) => (
        <li key={tag.id}>
          <Tag as={Link} to={`/${entity}?tags=${tag.id}`} tag={tag.name} />
        </li>
      ))}
    </ul>
  )
}
