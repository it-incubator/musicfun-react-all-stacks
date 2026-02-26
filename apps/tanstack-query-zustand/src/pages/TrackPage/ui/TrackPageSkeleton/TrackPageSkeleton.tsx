import { useTranslation } from 'react-i18next'

import { PageWithoutHeader, SearchTextField } from '@/pages/common'
import { Skeleton, Typography } from '@/shared/components'

import s from './TrackPageSkeleton.module.css'

const INFO_LINES = 3
const PLAYLIST_ROWS = 4

export const TrackPageSkeleton = () => {
  const { t } = useTranslation()

  return (
    <PageWithoutHeader className={s.trackPage}>
      <div className={s.trackOverview}>
        <Skeleton height="300px" width="300px" />
        <div className={s.content}>
          <Skeleton height="35px" width="400px" />
          <Skeleton width="500px" height="55px" />
          <div>
            {Array.from({ length: INFO_LINES }).map((_, index) => (
              <Skeleton key={index} height="25px" />
            ))}
          </div>
          <Skeleton width="150px" height="30px" />
        </div>
      </div>

      <Skeleton width="300px" height="70px" />

      <Typography variant="h2" className={s.title}>
        {t('placeholder.which_playlist')}
      </Typography>

      <SearchTextField placeholder={t('playlists.placeholder.search_playlist')} />

      <div className={s.playlists}>
        {Array.from({ length: PLAYLIST_ROWS }).map((_, index) => (
          <Skeleton key={index} height="70px" width="100%" />
        ))}
      </div>
    </PageWithoutHeader>
  )
}
