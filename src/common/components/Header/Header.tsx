import { Path } from "@/common/routing"
import { NavLink } from "react-router"
import s from "./Header.module.css"

export const Header = () => {
  return (
    <header className={s.wrapper}>
      <nav>
        <ul className={s.list}>
          <li>
            <NavLink to={Path.Main}>Main</NavLink>
          </li>
          <li>
            <NavLink to={Path.Playlists}>Playlists</NavLink>
          </li>
          <li>
            <NavLink to={Path.Tracks}>Tracks</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
