import { PlaylistCardSkeleton } from '@/entities/playlist'
import { Skeleton } from '@/shared/components'

import s from './UserTabsSkeleton.module.css'

export const UserTabsSkeleton = () => {
  return (
    <div className={s.tabs}>
      <Skeleton height="45px" />
      <Skeleton width="330px" height="55px" />
      <div className={s.playlistsTab}>
        {Array.from({ length: 5 }).map((_, index) => (
          <PlaylistCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
