import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router"
import { App } from "./app/App.tsx"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*  ❗ always stale → fetch again whenever the query is used  */
      staleTime: 0,

      /*  no background retries after a failure  */
      retry: false,
      /*  keep the automatic triggers that make it “always actual”  */
      refetchOnMount: false,          // when component (re)mounts
      refetchOnWindowFocus: false,    // when tab gains focus
      refetchOnReconnect: false,      // when network comes back
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
