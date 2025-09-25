import { LogoutButton } from '@/features/auth/ui/logout-button/logout-button.tsx'
import { useMeQuery } from '../../api/use-me.query.ts'
import { Link } from '@tanstack/react-router'
import styles from '../account-bar.module.css'

export const CurrentUser = () => {
  const query = useMeQuery()

  return (
    <div className={styles.meInfoContainer}>
      <Link to="/my-playlists" activeOptions={{ exact: true }}>
        {query.data!.login}
      </Link>

      <LogoutButton />
    </div>
  )
}
