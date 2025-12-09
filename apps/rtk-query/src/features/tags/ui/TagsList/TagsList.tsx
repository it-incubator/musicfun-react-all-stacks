import { Link } from 'react-router'

import { Tag } from '@/shared/components'

import type { Tag as TagType } from '../../api/tagsApi.types'
import s from './TagsList.module.css'

export const TagsList = ({
  tags,
  entity = 'tracks',
}: {
  tags: TagType[]
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
