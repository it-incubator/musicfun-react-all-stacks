import clsx from 'clsx'
import { type ComponentProps } from 'react'

import { TagsList } from '@/features/tags'
import type { Tag } from '@/features/tags/api/tagsApi.types'
import Placeholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Typography } from '@/shared/components'

import s from './TrackOverview.module.css'

type TrackOverviewProps = {
  title: string
  image?: string
  addedAt: string
  artists: string[]
  tags: Tag[]
} & ComponentProps<'div'>

export const TrackOverview = ({
  title,
  image = Placeholder,
  addedAt,
  tags,
  className,
  artists,
  ...props
}: TrackOverviewProps) => {
  return (
    <div className={clsx(s.container, className)} {...props}>
      <div className={s.imageContainer}>
        <img src={image} alt="" aria-hidden />
      </div>

      <div className={s.content}>
        <TagsList tags={tags} entity="tracks" />

        <Typography variant="h1" as="h1" className={s.title}>
          {title}
        </Typography>

        <div className={s.info}>
          <Typography variant="body1">{artists.join(', ')}</Typography>
          <Typography variant="body2">{new Date(addedAt).toLocaleDateString()}</Typography>
        </div>
      </div>
    </div>
  )
}
