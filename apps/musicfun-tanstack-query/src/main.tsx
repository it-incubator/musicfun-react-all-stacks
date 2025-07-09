import './styles/fonts.css'
import './styles/variables.css'
import './styles/reset.css'
import './styles/global.css'

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { localStorageKeys } from '@/features/auth/types/auth-api.types.ts'
import { setClientConfig } from '@/shared/api/client.ts'

import { App } from './app/App.tsx'

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

setClientConfig({
  baseURL: import.meta.env.VITE_BASE_URL,
  apiKey: import.meta.env.VITE_API_KEY,
  getAccessToken: async () => localStorage.getItem(localStorageKeys.accessToken),
  getRefreshToken: async () => localStorage.getItem(localStorageKeys.refreshToken),
  saveAccessToken: async (token) =>
    token
      ? localStorage.setItem(localStorageKeys.accessToken, token)
      : localStorage.removeItem(localStorageKeys.accessToken),
  saveRefreshToken: async (token) =>
    token
      ? localStorage.setItem(localStorageKeys.refreshToken, token)
      : localStorage.removeItem(localStorageKeys.refreshToken),
})

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    //onError: mutationGlobalErrorHandler, // 🔹 вызывается ВСЕГДА
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
