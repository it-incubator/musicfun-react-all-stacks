import { QueryClientProvider } from '@tanstack/react-query'
import { Header } from '@/shared/ui/header/header.component.tsx'
import styles from '@/app/layouts/root-layout.module.css'
import { Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import { AccountBar } from '@/features/auth'
import { queryClient } from '@/app/query-client/query-client.tsx'
import { WebSocketProvider } from '@/app/providers/web-socket-provider.tsx'

export function RootLayout() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <Header renderAccountBar={() => <AccountBar />} />
          <div className={styles.container}>
            <Outlet />
          </div>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
          <ToastContainer />
        </WebSocketProvider>
      </QueryClientProvider>
    </>
  )
}
