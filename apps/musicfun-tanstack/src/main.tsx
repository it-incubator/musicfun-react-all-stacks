import { setInstanceConfig } from '@/common/instance'
import { getSharedSocket } from '@/socket.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import { App } from './app/App.tsx'
import { PlayerProvider } from '@/modules/musicstaff/player/lib/context/PlayerProvider.tsx'
import { PlayerCore } from '@/modules/musicstaff/player/model/PlayerCore.ts'
import { PlayerLogic } from '@/modules/musicstaff/player/model/PlayerLogic.ts'
import { setClientConfig } from '@/common/api/client.ts'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*  ❗ always stale → fetch again whenever the query is used  */
      staleTime: 0,
      /*  no background retries after a failure  */
      retry: false,
      /*  keep the automatic triggers that make it “always actual”  */
      refetchOnMount: false, // when component (re)mounts
      refetchOnWindowFocus: false, // when tab gains focus
      refetchOnReconnect: false, // when network comes back
    },
  },
})

setInstanceConfig({
  baseURL: import.meta.env.VITE_BASE_URL,
  apiKey: import.meta.env.VITE_API_KEY,
})

setClientConfig({ baseURL: import.meta.env.VITE_BASE_URL, apiKey: import.meta.env.VITE_API_KEY })

export const playerCore = new PlayerCore()
export const playerLogic = new PlayerLogic(playerCore)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <PlayerProvider player={playerLogic}>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </PlayerProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition={'top-right'} />
    </QueryClientProvider>
  </BrowserRouter>,
)

function WebSocketProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const socket = getSharedSocket(import.meta.env.VITE_AUTH_TOKEN)

    socket.on('track-added-to-playlist', (data: TrackAddedToPlaylistPayload) => {
      console.log(data)
    })
  }, [])

  return <>{children}</>
}

type TrackAddedToPlaylistPayload = {
  type: 'track-added-to-playlist'
  payload: {
    trackId: string
    trackTitle: string
    playlistId: string
    playlistTitle: string
    userId: string
    userName: string
  }
}
