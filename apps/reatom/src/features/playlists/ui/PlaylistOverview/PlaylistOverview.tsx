import clsx from 'clsx'
import { type ComponentProps } from 'react'

import { TagsList } from '@/features/tags'
import { Typography } from '@/shared/components'

import s from './PlaylistOverview.module.css'

type PlaylistOverviewProps = {
  title: string
  image: string
  description: string
  tags: string[]
} & ComponentProps<'div'>

export const PlaylistOverview = ({
  title,
  image,
  description,
  tags,
  className,
  ...props
}: PlaylistOverviewProps) => {
  return (
    <div className={clsx(s.container, className)} {...props}>
      <div className={s.imageContainer}>
        <img src={image} alt="" aria-hidden />
      </div>

      <div className={s.content}>
        <TagsList tags={tags} entity="playlists" />

        <Typography variant="h1" as="h1" className={s.title}>
          {title}
        </Typography>

        <div className={s.info}>
          <Typography variant="body1" className={s.description}>
            {description}
          </Typography>
        </div>
      </div>
    </div>
  )
}
