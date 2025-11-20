import * as React from 'react'
import { Link } from 'react-router'

import type { SchemaPlaylistImagesOutputDto } from '@/shared/api/schema.ts'
import { Card, Typography } from '@/shared/components'
import { VU } from '@/shared/utils'

import s from './PlaylistCard.module.css'

interface PlaylistCardProps {
  id: string
  title?: string
  images?: SchemaPlaylistImagesOutputDto
  description: string | null
  footer?: React.ReactNode
}

export const PlaylistCard: React.FC<PlaylistCardProps> = (props) => {
  const { title, images, description, id, footer } = props

  const imageSrc = React.useMemo(() => {
    return VU.isValidArray(images?.main) ? images.main[0].url : void 0
  }, [images?.main])

  if (!VU.isValidString(id)) {
    return null
  }

  return (
    <Card as={Link} to={`/playlists/${id}`} className={s.card}>
      <div className={s.image}>
        <CoverImage imageSrc={imageSrc} imageDescription={'cover'} aria-hidden />
      </div>
      <Typography variant="h3" className={s.title}>
        {VU.isValid(title) && title}
      </Typography>
      <Typography variant="body3" className={s.description}>
        {VU.isValid(description) && description}
      </Typography>
      {VU.isValid(footer) && footer}
    </Card>
  )
}
