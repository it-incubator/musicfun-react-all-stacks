import clsx from 'clsx'
import { Link } from 'react-router'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Typography } from '@/shared/components'
import { Paths } from '@/shared/configs'
import s from './PlaylistRow.module.css'
import { useTranslation } from 'react-i18next'

type PlaylistRowProps = {
  id: string
  title: string
  imageSrc?: string
  trackCount?: number
  className?: string
}

export const PlaylistRow = ({
  title,
  imageSrc = noCoverPlaceholder,
  id,
  className,
}: PlaylistRowProps) => {
  const { t } = useTranslation()
  return (
    <div className={clsx(s.playlistRow, className)}>
      <Link to={`${Paths.Playlists}/${id}`} className={s.playlistLink}>
        <div className={s.image}>
          <img src={imageSrc} alt={title} />
        </div>

        <div className={s.titleWrapper}>
          <Typography variant="body1" as="h2" className={s.title}>
            {title}
          </Typography>
        </div>
      </Link>

      <div className={s.trackCounts}>
        <Typography variant="body2" as="span" className={s.trackCount}>
          {t('playlist.tracks_count', { count: 143 })}
        </Typography>
      </div>
    </div>
  )
}
