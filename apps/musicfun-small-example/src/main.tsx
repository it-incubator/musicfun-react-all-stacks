import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/index.css'
import { setClientConfig } from './shared/api/client.ts'
import { localStorageKeys } from './shared/db/localstorage-keys.ts'
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'

const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
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

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
