import type { FC } from 'react'

import { PlaylistCard } from '../PlaylistCard'
import type { PlaylistItemProps } from './PlaylistItem.types.ts'

export const PlaylistItem: FC<PlaylistItemProps> = (props) => {
  const { playlist } = props

  const { title, images, description } = playlist.attributes

  return <PlaylistCard id={playlist.id} title={title} images={images} description={description} render={() => null} />
}
