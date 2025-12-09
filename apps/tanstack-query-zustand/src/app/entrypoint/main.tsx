import '@/app/styles/fonts.css'
import '@/app/styles/variables.css'
import '@/app/styles/reset.css'
import '@/app/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { toast } from 'react-toastify'

import { queryClient } from '@/app/query-client/query-client.tsx'
import { setClientConfig } from '@/shared/api/client.ts'
import { API_BASE_URL, API_KEY, CURRENT_APP_DOMAIN } from '@/shared/config/config.ts'
import { PrerenderReady } from '@/shared/ui/prerender-ready.tsx'
import { authStorage } from '@/shared/utils/authStorage.ts'

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
  getAccessToken: async () => authStorage.getAccessToken(),
  getRefreshToken: async () => authStorage.getRefreshToken(),
  saveAccessToken: async (token) =>
    token ? authStorage.saveAccessToken(token) : authStorage.clearAccessToken(),
  saveRefreshToken: async (token) =>
    token ? authStorage.saveRefreshToken(token) : authStorage.clearRefreshToken(),

  toManyRequestsErrorHandler: (message: string | null) => {
    toast(message)
  },
  logoutHandler: () => {
    // store.dispatch(logoutThunk())
  },
})

const baseName = CURRENT_APP_DOMAIN ? '/' + CURRENT_APP_DOMAIN : ''

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename={baseName}>
      <App />
      <PrerenderReady />
    </BrowserRouter>
  </QueryClientProvider>
)
