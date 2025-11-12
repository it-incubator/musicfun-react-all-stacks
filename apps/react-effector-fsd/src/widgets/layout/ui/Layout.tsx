import clsx from 'clsx'
import { Outlet } from 'react-router'

// import { Player } from '@/widgets/Player'

import { Header } from './Header/Header.tsx'
import s from './Layout.module.css'
import { Sidebar } from './Sidebar/Sidebar.tsx'

export const Layout = () => {
  const IS_PLAYER_OPEN = false

  return (
    <div className={clsx(s.grid, IS_PLAYER_OPEN && s.playerOpen)}>
      <Header />
      <Sidebar />
      <main className={s.main}>
        <Outlet />
      </main>
      {/*{IS_PLAYER_OPEN && <Player />}*/}
    </div>
  )
}
