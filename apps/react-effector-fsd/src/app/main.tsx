import '@/app/styles/fonts.css'
import '@/app/styles/variables.css'
import '@/app/styles/reset.css'
import '@/app/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/effector">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
