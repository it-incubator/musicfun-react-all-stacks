import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from "./store/store.ts"
import { setInstanceConfig } from "@it-incubator/spotifun-api-sdk"

setInstanceConfig({
  baseURL: import.meta.env.VITE_BASE_URL,
  apiKey: import.meta.env.VITE_API_KEY,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
