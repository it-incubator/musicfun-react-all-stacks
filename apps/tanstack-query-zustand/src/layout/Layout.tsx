import clsx from 'clsx'
import { Outlet } from 'react-router'

import {
  EditProfileModal,
  selectIsEditProfileModalOpen,
  useHydrateProfile,
  useProfileStore,
} from '@/features/profile'
import { useCurrentTrack } from '@/player'
import { Player } from '@/widgets/Player'

import { Header } from './Header'
import s from './Layout.module.css'
import { Sidebar } from './Sidebar'

export const Layout = () => {
  const { track: currentTrack } = useCurrentTrack()
  const isPlayerOpen = !!currentTrack
  const isEditProfileOpen = useProfileStore(selectIsEditProfileModalOpen)

  useHydrateProfile()

  return (
    <div className={clsx(s.grid, isPlayerOpen && s.playerOpen)}>
      <Header />
      <Sidebar />
      <main className={s.main}>
        <Outlet />
      </main>
      {isPlayerOpen && <Player />}
      {isEditProfileOpen && <EditProfileModal />}
    </div>
  )
}
