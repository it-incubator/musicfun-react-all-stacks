import avatarDefault from '@/assets/img/avatar-default.png'
import s from './ProfileInfo.module.css'
import { useGetMeQuery } from '@/features/auth/api/auth-api.ts'

export const ProfileInfo = () => {
  const { data } = useGetMeQuery()

  return (
    <div>
      <img className={s.avatar} src={avatarDefault} alt="avatar" />
      <div>{data?.login ?? '—'}</div>
    </div>
  )
}
