import '@/app/styles/fonts.css'
import '@/app/styles/variables.css'
import '@/app/styles/reset.css'
import '@/app/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { toast } from 'react-toastify'

import { queryClient } from '@/app/query-client/query-client.tsx'
import { localStorageKeys } from '@/features/auth/types/auth-api.types.ts'
import { setClientConfig } from '@/shared/api/client.ts'
import { API_BASE_URL, API_KEY } from '@/shared/config/config.ts'
import { PrerenderReady } from '@/shared/ui/prerender-ready.tsx'

import { App } from '../App.tsx'

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
  baseURL: API_BASE_URL,
  apiKey: API_KEY,
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

  toManyRequestsErrorHandler: (message: string | null) => {
    toast(message)
  },
  logoutHandler: () => {
    // store.dispatch(logoutThunk())
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/reatom">
        <App />
        <PrerenderReady />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
