import { Link } from '@tanstack/react-router'
import styles from '../account-bar.module.css'
import { useMeQuery } from '../../api/use-me-query.ts'
import { LogoutButton } from '../logout-button.tsx'

export const CurrentUser = () => {
  const query = useMeQuery()

  if (!query.data) return <span>...</span>

  return (
    <div className={styles.meInfoContainer}>
      <Link to="/my-playlists" activeOptions={{ exact: true }}>
        {query.data!.login} <LogoutButton />
      </Link>
    </div>
  )
}
