import { MenuLinks } from './MenuLinks/MenuLinks.tsx'
import s from './Sidebar.module.css'

export const Sidebar = () => {
  return (
    <div className={s.sidebar}>
      <MenuLinks />
    </div>
  )
}
