import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      refetchOnWindowFocus: false, // в RN окна нет
      refetchOnMount: false,
      refetchOnReconnect: false,
      // gcTime: 5_000,
      retry: 1,
    },
  },
})
