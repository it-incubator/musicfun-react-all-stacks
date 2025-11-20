import clsx from 'clsx'
import { Outlet } from 'react-router'

import { usePlayerStore } from '@/player/model/player-store.ts'
import { Player } from '@/widgets/Player'

import { Header } from './Header'
import s from './Layout.module.css'
import { Sidebar } from './Sidebar'

export const Layout = () => {
  const playerStore = usePlayerStore()
  const IS_PLAYER_OPEN = !!playerStore.currentTrack

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
