import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setClientConfig } from './shared/api/client.ts'
import { API_BASE_URL, API_KEY } from './shared/config/config.ts'
import { localStorageKeys } from './features/auth/types/auth-api.types.ts'
import { BrowserRouter } from 'react-router'

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
    alert(message)
  },
  logoutHandler: () => {
    // store.dispatch(logoutThunk())
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/reatom">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
