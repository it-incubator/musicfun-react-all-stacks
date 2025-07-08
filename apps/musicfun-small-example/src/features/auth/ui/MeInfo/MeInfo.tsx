import { Logout } from '../Logout/Logout.tsx'
import { useMeQuery } from '../../api/use-me.query.ts'
import { Link } from '@tanstack/react-router'

export const MeInfo = () => {
  const query = useMeQuery()

  return (
    <div>
      <Link to="/my-playlists-with-filters" activeOptions={{ exact: true }}>
        Login: {query.data!.data!.login}
      </Link>

      <Logout />
    </div>
  )
}
