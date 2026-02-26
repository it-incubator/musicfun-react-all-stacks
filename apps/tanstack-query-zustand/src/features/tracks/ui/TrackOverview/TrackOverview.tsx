import clsx from 'clsx'
import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { type TagDto, TagsList } from '@/features/tags'
import noCoverPlaceholder from '@/assets/img/no-cover-placeholder.avif'
import { Typography } from '@/shared/components'

import s from './TrackOverview.module.css'

type TrackOverviewProps = {
  title: string
  image?: string
  addedAt: string
  artists?: string[]
  tags?: TagDto[]
} & ComponentProps<'div'>

export const TrackOverview = ({
  title,
  image = noCoverPlaceholder,
  addedAt,
  tags,
  className,
  artists,
  ...props
}: TrackOverviewProps) => {
  const { t } = useTranslation()

  return (
    <div className={clsx(s.container, className)} {...props}>
      <div className={s.imageContainer}>
        <img src={image} alt="" aria-hidden />
      </div>

      <div className={s.content}>
        <TagsList tags={tags || []} entity="tracks" />

        <Typography variant="h1" as="h1" className={s.title}>
          {title}
        </Typography>

        <div className={s.info}>
          <Typography variant="body1">{(artists || []).join(', ')}</Typography>
          <Typography variant="body2">
            {`${t('tracks.release')} ${new Date(addedAt).toLocaleDateString()}`}
          </Typography>
        </div>
      </div>
    </div>
  )
}
