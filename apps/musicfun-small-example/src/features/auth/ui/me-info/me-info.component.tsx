import { Logout } from '@/features/auth/ui/logout/logout.component.tsx'
import { useMeQuery } from '../../api/use-me.query.ts'
import { Link } from '@tanstack/react-router'
import styles from '../user-block.module.css'

export const MeInfoComponent = () => {
  const query = useMeQuery()

  return (
    <div className={styles.meInfoContainer}>
      <Link to="/my-playlists-with-filters" activeOptions={{ exact: true }}>
        {query.data!.login}
      </Link>

      <Logout />
    </div>
  )
}
