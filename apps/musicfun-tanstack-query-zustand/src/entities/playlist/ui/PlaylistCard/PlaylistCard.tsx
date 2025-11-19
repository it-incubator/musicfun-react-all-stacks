import type { FC, ReactNode } from 'react'
import { Link } from 'react-router'

import type { SchemaPlaylistImagesOutputDto } from '@/shared/api/schema.ts'
import { Button, Card, Typography } from '@/shared/components'
import { useDeletePlaylistAction } from '@/shared/hooks/useDeletePlaylistAction'
import { VU } from '@/shared/utils'

import stab from '../../../../assets/img/no-cover.png'
import s from './PlaylistCard.module.css'

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
  const handleDeletePlaylist = useDeletePlaylistAction(id)

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
      <Button className={s.btnDelete} onClick={handleDeletePlaylist}>
        Delete
      </Button>
    </Card>
  )
}
