import { Path } from "@/common/routing"
import { NavLink } from "react-router"
import s from "./Header.module.css"

export const Header = () => {
  return (
    <header className={s.wrapper}>
      <nav>
        <ul className={s.list}>
          <li>
            <NavLink className={"link"} to={Path.Main}>
              Main
            </NavLink>
          </li>
          <li>
            <NavLink className={"link"} to={Path.Playlists}>
              Playlists
            </NavLink>
          </li>
          <li>
            <NavLink className={"link"} to={Path.Tracks}>
              Tracks
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
