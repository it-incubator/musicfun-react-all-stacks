import clsx from 'clsx'
import { Outlet } from 'react-router'

import { selectIsAuthModalOpen, setIsAuthModalOpen } from '@/features/auth/model'
import { LoginModal } from '@/features/auth'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { Player } from '@/widgets/Player'

import { Header } from './Header'
import s from './Layout.module.css'
import { Sidebar } from './Sidebar'

export const Layout = () => {
  const IS_PLAYER_OPEN = false
  const isAuthModalOpen = useAppSelector(selectIsAuthModalOpen)
  const dispatch = useAppDispatch()

  const handleCloseAuthModal = () => {
    dispatch(setIsAuthModalOpen({ isAuthModalOpen: false }))
  }

  return (
    <div className={clsx(s.grid, IS_PLAYER_OPEN && s.playerOpen)}>
      <Header />
      <Sidebar />
      <main className={s.main}>
        <Outlet />
      </main>
      {IS_PLAYER_OPEN && <Player />}
      {isAuthModalOpen && <LoginModal onClose={handleCloseAuthModal} />}
    </div>
  )
}
