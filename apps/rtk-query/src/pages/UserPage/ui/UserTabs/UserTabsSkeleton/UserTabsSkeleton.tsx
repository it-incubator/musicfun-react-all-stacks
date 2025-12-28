import { Skeleton } from '@/shared/components'
import { PlaylistCardSkeleton } from '@/features/playlists'
import s from './UserTabsSkeleton.module.css'

export const UserTabsSkeleton = () => {
  return (
    <div className={s.tabs}>
      <Skeleton height={'45px'} />
      <Skeleton width={'330px'} height={'55px'} />
      <div className={s.playlistsTab}>
        {Array.from({ length: 5 }).map((_el, i) => (
          <PlaylistCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
