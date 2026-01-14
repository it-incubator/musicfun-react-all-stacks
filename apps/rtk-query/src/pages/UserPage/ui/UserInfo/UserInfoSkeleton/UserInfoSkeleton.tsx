import { Skeleton } from '@/shared/components'
import s from './UserInfoSkeleton.module.css'

export const UserInfoSkeleton = () => {
  return (
    <div className={s.box}>
      <Skeleton circle={true} width={'192px'} height={'192px'} />
      <Skeleton height={'30px'} width={'192px'} />
      <Skeleton height={'40px'} width={'192px'} />
      <Skeleton height={'55px'} width={'192px'} />
    </div>
  )
}
