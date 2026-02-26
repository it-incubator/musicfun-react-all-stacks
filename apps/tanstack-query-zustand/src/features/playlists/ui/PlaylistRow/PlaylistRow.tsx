import clsx from 'clsx'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

import noCoverPlaceholder from '@/assets/img/no-cover-placeholder.avif'
import { Typography } from '@/shared/components'

import s from './PlaylistRow.module.css'

type PlaylistRowProps = {
  id: string
  title: string
  imageSrc?: string
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
      <Link to={`/playlists/${id}`} className={s.playlistLink}>
        <div className={s.image}>
          <img src={imageSrc} alt={title} />
        </div>

        <div>
          <Typography variant="body1" as="h2" className={s.title}>
            {title}
          </Typography>
        </div>
      </Link>

      <div className={s.trackCounts}>
        <Typography variant="body2" as="span">
          {t('playlist.tracks_count', { count: 0 })}
        </Typography>
      </div>
    </div>
  )
}
