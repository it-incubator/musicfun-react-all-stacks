import { Path } from '@/common/routing'
import { useGetMeQuery, useLogoutMutation } from '@/features/auth/api/authApi.ts'
import { Login } from '@/features/auth/ui/Login/Login.tsx'
import { Link, NavLink } from 'react-router'
import s from './Header.module.css'

const navItems = [
  { to: Path.Main, label: 'Main' },
  { to: Path.Playlists, label: 'Playlists' },
  { to: Path.Tracks, label: 'Tracks' },
]

export const Header = () => {
  const { data } = useGetMeQuery(undefined)
  const [logout] = useLogoutMutation()

  const logoutHandler = () => logout()

  return (
    <header className={s.container}>
      <div className={s.shell}>
        <nav>
          <ul className={s.list}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={({ isActive }) => (isActive ? `${s.link} ${s.activeLink}` : s.link)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {data && (
          <div className={s.loginContainer}>
            <Link to={Path.Profile} className={s.profileLink}>
              {data.login}
            </Link>
            <button className="button-ghost" onClick={logoutHandler}>
              Logout
            </button>
          </div>
        )}

        {!data && <Login />}
      </div>
    </header>
  )
}
