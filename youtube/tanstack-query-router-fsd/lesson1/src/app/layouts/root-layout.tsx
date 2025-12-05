import 'react-toastify/dist/ReactToastify.css'

import { Outlet } from '@tanstack/react-router'
import { ToastContainer } from 'react-toastify'

import { AccountBar } from '../../features/auth/ui/account-bar.tsx'
import { Header } from '../../shared/ui/header/header.tsx'
import styles from './root-layout.module.css'

export const RootLayout = () => (
  <>
    <Header renderAccountBar={() => <AccountBar />} />
    <div className={styles.container}>
      <Outlet />
      <ToastContainer />
    </div>
  </>
)
