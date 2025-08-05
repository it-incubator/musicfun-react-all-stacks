import './styles/fonts.css'
import './styles/variables.css'
import './styles/reset.css'
import './styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
