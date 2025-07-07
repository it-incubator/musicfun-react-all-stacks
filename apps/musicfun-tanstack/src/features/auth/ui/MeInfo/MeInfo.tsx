import { Path } from '@/common/routing'
import { Logout } from '../Logout/Logout.tsx'
import { useMe } from '../../api/useMe.ts'
import { NavLink } from 'react-router'

export const MeInfo = () => {
  const query = useMe()

  return (
    <div>
      userLogin:
      <NavLink to={Path.Profile}> {query.data?.data.login}</NavLink>
      <Logout />
    </div>
  )
}
