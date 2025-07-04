import { Path } from '@/common/routing'
import { NavLink } from 'react-router'
import s from './Header.module.css'
import { UserBlock } from '@/modules/auth/ui/UserBlock.tsx'

const navItems = [
  { to: Path.Main, label: 'Main' },
  { to: Path.Playlists, label: 'Playlists' },
  { to: Path.Tracks, label: 'Tracks' },
  { to: Path.Artists, label: 'Artists' },
  { to: Path.Tags, label: 'Tags' },
]

export const Header = () => {
  return (
    <header className={`flex-container ${s.wrapper}`}>
      <nav>
        <ul className={s.list}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `link ${isActive ? 'activeLink' : ''}`}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <UserBlock />
    </header>
  )
}
