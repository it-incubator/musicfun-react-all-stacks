import { MutationCache, QueryClient } from '@tanstack/react-query'

import { mutationGlobalErrorHandler } from '@/shared/ui/utils/query-error-handler-for-rhf-factory.ts'

export const queryClient = new QueryClient({
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
