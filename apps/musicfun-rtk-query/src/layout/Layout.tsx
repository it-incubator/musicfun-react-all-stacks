import clsx from 'clsx'
import { Outlet } from 'react-router'

import { LoginModal } from '@/features/auth'
import { selectIsAuthModalOpen } from '@/features/auth/model'
import { CreateEditPlaylistModal, selectIsCreateEditModalOpen } from '@/features/playlists'
import { AppLoader } from '@/layout/AppLoader'
import { useAppSelector } from '@/shared/hooks'
import { Player } from '@/widgets/Player'

import { Header } from './Header'
import s from './Layout.module.css'
import { Sidebar } from './Sidebar'

export const Layout = () => {
  const IS_PLAYER_OPEN = false
  const isCreatePlaylistModalOpen = useAppSelector(selectIsCreateEditModalOpen)
  const isAuthModalOpen = useAppSelector(selectIsAuthModalOpen)

  return (
    <>
      <AppLoader />
      <div className={clsx(s.grid, IS_PLAYER_OPEN && s.playerOpen)}>
        <Header />

        <Sidebar />
        <main className={s.main}>
          <Outlet />
        </main>
        {IS_PLAYER_OPEN && <Player />}
        {isAuthModalOpen && <LoginModal />}
        {isCreatePlaylistModalOpen && <CreateEditPlaylistModal />}
      </div>
    </>
  )
}
