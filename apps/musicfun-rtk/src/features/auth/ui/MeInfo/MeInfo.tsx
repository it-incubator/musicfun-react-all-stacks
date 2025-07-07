import type { ChangeEvent } from 'react'
import { useGetMeQuery, useLogoutMutation } from '@/features/auth/api/auth-api.ts'
import { useNavigate } from 'react-router'
import { Path } from '@/common/routing'
import avatarDefault from '@/assets/img/avatar-default.png'
import s from './MeInfo.module.css'

export const MeInfo = () => {
  const navigate = useNavigate()

  const { data } = useGetMeQuery()
  const [mutate] = useLogoutMutation()

  const onValueChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'profile') {
      navigate(Path.Profile)
    } else if (value === 'logout') {
      mutate()
    }
  }

  return (
    <div className={s.container}>
      <img className={s.avatar} src={avatarDefault} alt="avatar" />
      <select onChange={onValueChange} value={'me'}>
        <option value={'me'} hidden>
          {data?.login}
        </option>
        <option value="profile">My profile</option>
        <option value={'logout'}>Logout</option>
      </select>
      {/*<NavLink to={Path.Profile}>{data?.login} </NavLink>*/}
      {/*<Logout />*/}
    </div>
  )
}
