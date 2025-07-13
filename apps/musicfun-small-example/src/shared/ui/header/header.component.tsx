import { Link } from '@tanstack/react-router'
import { UserBlock } from '@/features/auth'
import styles from './header.module.css'

type Props = {}

export const Header = ({}: Props) => (
  <header className={styles.header}>
    <div className={styles.container}>
      <div className={styles.linksBlock}>
        <Link to="/" className="[&.active]:font-bold">
          Playlists
        </Link>
        <Link to="/playlists-with-filters" className="[&.active]:font-bold">
          Playlists with Filter
        </Link>
      </div>

      <div>
        <UserBlock />
      </div>
    </div>
  </header>
)
