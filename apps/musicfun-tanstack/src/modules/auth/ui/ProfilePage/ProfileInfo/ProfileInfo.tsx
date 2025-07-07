import avatarDefault from '@/assets/img/avatar-default.png'
import { useMeQuery } from '@/modules/auth/api/use-me.query.ts'
import s from './ProfileInfo.module.css'

export const ProfileInfo = () => {
  const { data } = useMeQuery()

  return (
    <div>
      <img className={s.avatar} src={avatarDefault} alt="avatar" />
      <div>{data?.data.login}</div>
    </div>
  )
}
