import { Path } from "@/common/routing"
import { NavLink } from "react-router"
import s from "./Header.module.css"

const navItems = [
  { to: Path.Main, label: "Main" },
  { to: Path.Boards, label: "Boards" },
]

export const Header = () => {
  return (
    <header className={s.wrapper}>
      <nav>
        <ul className={s.list}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `link ${isActive ? "activeLink" : ""}`}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
