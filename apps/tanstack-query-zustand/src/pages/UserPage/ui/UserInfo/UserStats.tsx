import { useTranslation } from 'react-i18next'

import { Typography } from '@/shared/components'

import s from './UserStats.module.css'

type UserStatsProps = {
  playlistsCount?: number
  tracksCount?: number
}

export const UserStats = ({ playlistsCount = 0, tracksCount = 0 }: UserStatsProps) => {
  const { t } = useTranslation()

  return (
    <dl className={s.descriptionList}>
      <div className={s.descriptionItem}>
        <Typography as="dd" variant="body1">
          {playlistsCount}
        </Typography>
        <Typography as="dt" variant="body2">
          {t('profile.stats.playlists', { count: playlistsCount })}
        </Typography>
      </div>
      <div className={s.descriptionItem}>
        <Typography as="dd" variant="body1">
          {tracksCount}
        </Typography>
        <Typography as="dt" variant="body2">
          {t('profile.stats.tracks', { count: tracksCount })}
        </Typography>
      </div>
    </dl>
  )
}
