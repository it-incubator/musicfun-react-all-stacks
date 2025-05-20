import { Main } from "@/app/Main.tsx"
import { Playlists } from "@/features/playlists/ui/Playlists/Playlists.tsx"
import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
  Playlists: "/playlists",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    <Route path={Path.Playlists} element={<Playlists />} />
  </Routes>
)
