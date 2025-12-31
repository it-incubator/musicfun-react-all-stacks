import { Skeleton } from '@/shared/components'
import { PageWithoutHeader, SearchTextField } from '@/pages/common'
import s from './PlaylistPageSkeleton.module.css'
import { TracksTableSkeleton } from '@/features/tracks'
import { useTranslation } from 'react-i18next'
import { PLAYLIST_SKELETON_INFO_LINES, PLAYLIST_SKELETON_TABLE_ROWS } from '@/shared/constants'

export const PlaylistPageSkeleton = () => {
  const { t } = useTranslation()

  return (
    <PageWithoutHeader className={s.playlistPage}>
      <div className={s.playlistOverview}>
        <div className={s.imageContainer}>
          <Skeleton height={'300px'} width={'300px'} />
        </div>
        <div className={s.content}>
          <Skeleton height={'35px'} width={'400px'} />
          <Skeleton width={'500px'} height={'55px'} />

          <div className={s.info}>
            {Array.from({ length: PLAYLIST_SKELETON_INFO_LINES }).map((_el, i) => (
              <Skeleton height={'25px'} key={i} />
            ))}
          </div>
        </div>
      </div>
      <div className={s.playlistToolbar}>
        <SearchTextField placeholder={t('tracks.placeholder.search_tracks')} onChange={() => {}} />
        <Skeleton width={'25%'} height={'60px'} />
      </div>
      <TracksTableSkeleton count={PLAYLIST_SKELETON_TABLE_ROWS} />
    </PageWithoutHeader>
  )
}
