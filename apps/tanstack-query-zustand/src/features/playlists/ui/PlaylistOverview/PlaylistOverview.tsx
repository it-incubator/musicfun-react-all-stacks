import clsx from 'clsx'
import { type ComponentProps } from 'react'

import { type TagDto, TagsList } from '@/features/tags'
import { CoverImage, Typography } from '@/shared/components'

import { useTranslation } from 'react-i18next'

import s from './PlaylistOverview.module.css'

type PlaylistOverviewProps = {
  title: string
  image: string
  description: string
  tags: TagDto[]
  userName?: string
  tracksCount?: number
} & ComponentProps<'div'>

export const PlaylistOverview = ({
  title,
  image,
  description,
  tags,
  className,
  userName,
  tracksCount,
  ...props
}: PlaylistOverviewProps) => {
  const { t } = useTranslation()

  return (
    <div className={clsx(s.container, className)} {...props}>
      <div className={s.imageContainer}>
        <CoverImage imageSrc={image} imageDescription={'cover'} aria-hidden />
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
          <div className={s.meta}>
            {userName && (
              <Typography variant="body2" as="span" className={s.userName}>
                {t('playlist.made_for')} <strong>{userName}</strong>
              </Typography>
            )}
            {tracksCount !== undefined && (
              <>
                <span className={s.dot}>•</span>
                <Typography variant="body2" as="span" className={s.tracksCount}>
                  {t('playlist.tracks_count', { count: tracksCount })}
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
