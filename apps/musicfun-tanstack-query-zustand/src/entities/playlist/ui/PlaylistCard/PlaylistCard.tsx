import type { FC, ReactNode } from 'react'
import { Link } from 'react-router'

import type { SchemaPlaylistImagesOutputDto } from '@/shared/api/schema.ts'
import { Card, Typography } from '@/shared/components'

import stab from '../../../../assets/img/no-cover.png'
import s from './PlaylistCard.module.css'
import { VU } from '@/shared/utils'

type PlaylistCardPropsBase = {
  id: string
  title: string
  images: SchemaPlaylistImagesOutputDto
  description: string | null
}

type PlaylistCardProps = PlaylistCardPropsBase & {
  render?: () => ReactNode
}

export const PlaylistCard: FC<PlaylistCardProps> = (props) => {
  const { title, images, description, id, render } = props

  let imageSrc = images?.main?.length ? images.main[0].url : undefined

  if (!imageSrc) {
    imageSrc = stab
  }

  return (
    <Card as={Link} to={`/playlists/${id}`} className={s.card}>
      <div className={s.image}>
        <img src={imageSrc} alt="" aria-hidden />
      </div>
      <Typography variant="h3" className={s.title}>
        {title}
      </Typography>
      <Typography variant="body3" className={s.description}>
        {description}
      </Typography>
      {VU.isFunction(render) && render()}
    </Card>
  )
}
