import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useEffect } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router"
import { App } from "./app/App.tsx"
import { getSharedSocket } from "@/socket.ts"

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

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>,
)

function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const socket = getSharedSocket(import.meta.env.VITE_AUTH_TOKEN)

    socket.on("track-added-to-playlist", (data: TrackAddedToPlaylistPayload) => {
      console.log(data)
    })
  }, [])

  return <>{children}</>
}

type TrackAddedToPlaylistPayload = {
  type: "track-added-to-playlist"
  payload: {
    trackId: string
    trackTitle: string
    playlistId: string
    playlistTitle: string
    userId: string
    userName: string
  }
}
