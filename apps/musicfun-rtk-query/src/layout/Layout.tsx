import clsx from 'clsx'
import { Outlet } from 'react-router'

import { LoginModal } from '@/features/auth'
import { selectIsAuthModalOpen } from '@/features/auth/model'
import { CreateEditPlaylistModal, selectIsCreateEditModalOpen } from '@/features/playlists'
import { CreateEditTrackModal, selectIsCreateEditTrackModalOpen } from '@/features/tracks'
import { AppLoader } from '@/layout/AppLoader'
import { useAppSelector } from '@/shared/hooks'
import { Player } from '@/widgets/Player'

import { Header } from './Header'
import s from './Layout.module.css'
import { Sidebar } from './Sidebar'

export const Layout = () => {
  const IS_PLAYER_OPEN = true
  const isCreatePlaylistModalOpen = useAppSelector(selectIsCreateEditModalOpen)
  const isCreateTrackModalOpen = useAppSelector(selectIsCreateEditTrackModalOpen)
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
        {isCreateTrackModalOpen && <CreateEditTrackModal />}
      </div>
    </>
  )
}
