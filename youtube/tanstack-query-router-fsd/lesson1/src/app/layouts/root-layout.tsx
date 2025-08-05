import { Outlet } from '@tanstack/react-router'
import { Header } from '../../shared/ui/header/header.tsx'
import styles from './root-layout.module.css'
import { AccountBar } from '../../features/auth/ui/account-bar.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const RootLayout = () => (
  <>
    <Header renderAccountBar={() => <AccountBar />} />
    <div className={styles.container}>
      <Outlet />
      <ToastContainer />
    </div>
  </>
)
