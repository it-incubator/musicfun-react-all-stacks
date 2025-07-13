import { Link } from '@tanstack/react-router'
import styles from './header.module.css'
import type { ReactNode } from 'react'

type Props = {
  renderAccountBar: () => ReactNode
}

export const Header = ({ renderAccountBar }: Props) => (
  <header className={styles.header}>
    <div className={styles.container}>
      <div className={styles.linksBlock}>
        <Link to="/" className="[&.active]:font-bold">
          Main
        </Link>
        <Link to="/playlists-with-filters" className="[&.active]:font-bold">
          Playlists
        </Link>
      </div>

      <div>{renderAccountBar()}</div>
    </div>
  </header>
)
