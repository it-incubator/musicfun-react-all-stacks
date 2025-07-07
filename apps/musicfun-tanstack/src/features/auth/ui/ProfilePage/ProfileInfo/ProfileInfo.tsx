import avatarDefault from '@/assets/img/avatar-default.png'
import { useMe } from '@/features/auth/api/useMe.ts'
import s from './ProfileInfo.module.css'

export const ProfileInfo = () => {
  const { data } = useMe()

  return (
    <div>
      <img className={s.avatar} src={avatarDefault} alt="avatar" />
      <div>{data?.data.login}</div>
    </div>
  )
}
