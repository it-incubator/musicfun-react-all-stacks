import { MutationCache, QueryClient } from '@tanstack/react-query'
import { mutationGlobalErrorHandler } from '@/shared/api/query-error-handler-for-rhf-factory.ts'

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
