import { createRootRoute, Outlet } from '@tanstack/react-router'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { mutationGlobalErrorHandler } from '@/shared/api/query-error-handler-for-rhf-factory.ts'
import { type ReactNode } from 'react'
import styles from './__root.module.css'
import { Header } from '@/shared/ui/header/header.component.tsx'

export type MutationMeta = {
  /**
   * Если 'off' — глобальный обработчик ошибок пропускаем,
   * если 'on' (или нет поля) — вызываем.
   */
  globalErrorHandler?: 'on' | 'off'
}

declare module '@tanstack/react-query' {
  interface Register {
    /**
     * Тип для поля `meta` в useMutation(...)
     */
    mutationMeta: MutationMeta
  }
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: mutationGlobalErrorHandler, // 🔹 вызывается ВСЕГДА
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity, //5000,
      //gcTime: 10000 // если нет подписчиков - удалить всё нафик...
    },
  },
})

function WebSocketProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <Header />
          <div className={styles.container}>
            <Outlet />
          </div>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
          <ToastContainer />
        </WebSocketProvider>
      </QueryClientProvider>
    </>
  ),
})
