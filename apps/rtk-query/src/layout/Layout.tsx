import clsx from 'clsx'
import { Outlet, useLocation } from 'react-router'

import { LoginModal } from '@/features/auth'
import { selectIsAuthModalOpen } from '@/features/auth/model'
import { CreateEditPlaylistModal, selectIsCreateEditModalOpen } from '@/features/playlists'
import { EditProfileModal, selectIsEditProfileModalOpen } from '@/features/profile'
import { CreateEditTrackModal, selectIsCreateEditTrackModalOpen } from '@/features/tracks'
import { AppLoader } from '@/layout/AppLoader'
import { useAppSelector } from '@/shared/hooks'
import { Player } from '@/widgets/Player'

import { Header } from './Header'
import s from './Layout.module.css'
import { Sidebar } from './Sidebar'
import { isCompactHeaderPath } from '@/shared/utils'

export const Layout = () => {
  const IS_PLAYER_OPEN = true
  const isCreatePlaylistModalOpen = useAppSelector(selectIsCreateEditModalOpen)
  const isCreateTrackModalOpen = useAppSelector(selectIsCreateEditTrackModalOpen)
  const isAuthModalOpen = useAppSelector(selectIsAuthModalOpen)
  const isEditProfileOpen = useAppSelector(selectIsEditProfileModalOpen)

  const { pathname } = useLocation()
  const headerVariant = isCompactHeaderPath(pathname) ? 'compact' : 'default'

  return (
    <>
      <AppLoader />
      <div
        className={clsx(
          s.grid,
          headerVariant === 'compact' ? s.gridCompact : '',
          IS_PLAYER_OPEN && s.playerOpen
        )}>
        <Header variant={headerVariant} />
        <Sidebar />
        <main className={s.main}>
          <Outlet />
        </main>
        {IS_PLAYER_OPEN && <Player />}
        {isAuthModalOpen && <LoginModal />}
        {isCreatePlaylistModalOpen && <CreateEditPlaylistModal />}
        {isCreateTrackModalOpen && <CreateEditTrackModal />}
        {isEditProfileOpen && <EditProfileModal />}
      </div>
    </>
  )
}
