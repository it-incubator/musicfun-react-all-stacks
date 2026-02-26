import { useTranslation } from 'react-i18next'

import { TracksTableSkeleton } from '@/features/tracks'
import { PageWithoutHeader, SearchTextField } from '@/pages/common'
import { Skeleton } from '@/shared/components'

import s from './PlaylistPageSkeleton.module.css'

const INFO_LINES = 3
const TABLE_ROWS = 5

export const PlaylistPageSkeleton = () => {
  const { t } = useTranslation()

  return (
    <PageWithoutHeader className={s.playlistPage}>
      <div className={s.playlistOverview}>
        <Skeleton height="300px" width="300px" />
        <div className={s.content}>
          <Skeleton height="35px" width="400px" />
          <Skeleton width="500px" height="55px" />
          <div>
            {Array.from({ length: INFO_LINES }).map((_, index) => (
              <Skeleton key={index} height="25px" />
            ))}
          </div>
        </div>
      </div>
      <div className={s.playlistToolbar}>
        <SearchTextField placeholder={t('tracks.placeholder.search_tracks')} onChange={() => {}} />
        <Skeleton width="25%" height="60px" />
      </div>
      <TracksTableSkeleton count={TABLE_ROWS} />
    </PageWithoutHeader>
  )
}
