import { Skeleton } from '@/shared/components'
import s from './UserInfoSkeleton.module.css'

export const UserInfoSkeleton = () => {
  return (
    <div className={s.box}>
      <Skeleton circle={true} width={'96px'} height={'96px'} />
      <Skeleton height={'30px'} width={'180px'} />
      <Skeleton height={'34px'} width={'140px'} />
      <Skeleton height={'40px'} width={'190px'} />
    </div>
  )
}
