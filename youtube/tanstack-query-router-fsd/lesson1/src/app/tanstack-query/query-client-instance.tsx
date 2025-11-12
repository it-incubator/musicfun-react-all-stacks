import { MutationCache, QueryClient } from '@tanstack/react-query'
import { mutationGlobalErrorHandler } from '../../shared/ui/util/query-error-handler-for-rhf-factory.ts'

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
export const queryClientInstance = new QueryClient({
  mutationCache: new MutationCache({
    onError: mutationGlobalErrorHandler,
  }),
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      gcTime: 5 * 60 * 1000,
    },
  },
})
