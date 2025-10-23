import clsx from 'clsx'
import { Outlet } from 'react-router'

import { Player } from '@/widgets/Player'

import { Header } from './Header'
import s from './Layout.module.css'
import { Sidebar } from './Sidebar'

export const Layout = () => {
  const IS_PLAYER_OPEN = true

  return (
    <div className={clsx(s.grid, IS_PLAYER_OPEN && s.playerOpen)}>
      <Header />
      <Sidebar />
      <main className={s.main}>
        <Outlet />
      </main>
      {IS_PLAYER_OPEN && <Player />}
    </div>
  )
}
