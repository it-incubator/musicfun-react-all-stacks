import { Skeleton } from '@/shared/components'
import { PlaylistCardSkeleton } from '@/features/playlists'
import s from './UserTabsSkeleton.module.css'
import { USER_TABS_SKELETON_PLAYLISTS } from '@/shared/constants'

export const UserTabsSkeleton = () => {
  return (
    <div className={s.tabs}>
      <Skeleton height={'45px'} />
      <Skeleton width={'330px'} height={'55px'} />
      <div className={s.playlistsTab}>
        {Array.from({ length: USER_TABS_SKELETON_PLAYLISTS }).map((_el, i) => (
          <PlaylistCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
