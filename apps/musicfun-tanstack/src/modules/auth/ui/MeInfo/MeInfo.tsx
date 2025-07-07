import { Path } from '@/common/routing'
import { Logout } from '../Logout/Logout.tsx'
import { useMeQuery } from '../../api/use-me.query.ts'
import { NavLink } from 'react-router'

export const MeInfo = () => {
  const query = useMeQuery()

  return (
    <div>
      login:
      <NavLink to={Path.Profile}> {query.data!.data!.login}</NavLink>
      <Logout />
    </div>
  )
}
