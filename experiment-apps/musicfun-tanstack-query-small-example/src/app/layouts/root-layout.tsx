import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet } from '@tanstack/react-router'
import { ToastContainer } from 'react-toastify'

import styles from '@/app/layouts/root-layout.module.css'
import { WebSocketProvider } from '@/app/providers/web-socket-provider.tsx'
import { queryClient } from '@/app/query-client/query-client.tsx'
import { AccountBar } from '@/features/auth'
import { Header } from '@/shared/ui/header/header.component.tsx'

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
