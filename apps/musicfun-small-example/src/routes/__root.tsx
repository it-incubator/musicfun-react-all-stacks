import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserBlock } from '../features/auth/ui/UserBlock.tsx'
import { mutationGlobalErrorHandler } from '../shared/api/query-error-handler-for-rhf-factory.ts'

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

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="p-2 flex gap-2">
          <Link to="/" className="[&.active]:font-bold">
            Playlists
          </Link>
          {' | '}
          <Link to="/playlists-with-filters" className="[&.active]:font-bold">
            Playlists with Filter
          </Link>
          {' | '}
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </div>
        <hr />
        <div>
          <UserBlock />
        </div>
        <hr />

        <Outlet />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
        <ToastContainer />
      </QueryClientProvider>
    </>
  ),
})
