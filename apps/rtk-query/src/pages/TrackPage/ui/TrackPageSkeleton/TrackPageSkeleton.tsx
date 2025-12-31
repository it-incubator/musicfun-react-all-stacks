import { Skeleton, Typography } from '@/shared/components'
import s from './TrackPageSkeleton.module.css'
import { PageWithoutHeader } from '@/pages/common'
import { useTranslation } from 'react-i18next'
import { PlaylistCardSkeleton } from '@/features/playlists'
import { TRACK_SKELETON_INFO_LINES, TRACK_SKELETON_PLAYLISTS } from '@/shared/constants'

export const TrackPageSkeleton = () => {
  const { t } = useTranslation()

  return (
    <PageWithoutHeader className={s.trackPage}>
      <div className={s.trackOverview}>
        <div className={s.imageContainer}>
          <Skeleton height={'300px'} width={'300px'} />
        </div>
        <div className={s.content}>
          <Skeleton height={'35px'} width={'400px'} />
          <Skeleton width={'500px'} height={'55px'} />

          <div className={s.info}>
            {Array.from({ length: TRACK_SKELETON_INFO_LINES }).map((_el, i) => (
              <Skeleton height={'25px'} key={i} />
            ))}
          </div>
          <Skeleton width={'150px'} height={'30px'} />
        </div>
      </div>

      <Skeleton width={'300px'} height={'70px'} />

      <Typography variant="h2" className={s.title}>
        {t('placeholder.which_playlist')}
      </Typography>

      <div className={s.playlists}>
        {Array.from({ length: TRACK_SKELETON_PLAYLISTS }).map((_el, i) => (
          <PlaylistCardSkeleton key={i} />
        ))}
      </div>
    </PageWithoutHeader>
  )
}
