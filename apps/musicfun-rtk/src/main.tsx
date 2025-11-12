import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { App } from './app/ui/App.tsx'
import { store } from './app/model/store.ts'
import { PlayerProvider } from '@/features/player/lib/context/PlayerProvider.tsx'
import { PlayerCore } from '@/features/player/model/PlayerCore.ts'
import { PlayerLogic } from '@/features/player/model/PlayerLogic.ts'

export const playerCore = new PlayerCore()
export const playerLogic = new PlayerLogic(playerCore)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerProvider player={playerLogic}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </PlayerProvider>
  </StrictMode>,
)
