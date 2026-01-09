import React from 'react'

import { Skeleton } from '@/shared/components'

import s from './AudioPlayerSkeleton.module.css'

export const AudioPlayerSkeleton = () => {
  return (
    <div className={s.skeleton}>
      <section className={s.mySection}>
        <div className={s.infoTrack}>
          <Skeleton width="100%" height={100} />
          <div className={s.titleArtist}>
            <Skeleton width={100} height={30} />
            <Skeleton width={100} height={20} />
          </div>
        </div>
        <div>
          <div className={s.PlayBar}>
            <Skeleton width={200} height={20} />
            <Skeleton circle width={50} height={50} />
            <Skeleton width={200} height={20} />
          </div>
          <div>
            <Skeleton width="100%" height={16} />
          </div>
        </div>
        <div className={s.volume}>
          <Skeleton width={100} height={25} />
        </div>
      </section>
    </div>
  )
}
