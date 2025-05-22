import { Main } from "@/app/Main.tsx"
import { PlaylistPage } from "@/features/playlists/ui/PlaylistPage/PlaylistPage.tsx"
import { Playlists } from "@/features/playlists/ui/Playlists/Playlists.tsx"
import { TracksPage } from "@/features/tracks/ui/TracksPage/TracksPage.tsx"

import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
  Playlists: "/playlists",
  Tracks: "/tracks",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    <Route path={Path.Playlists} element={<Playlists />} />
    <Route path={`${Path.Playlists}/:id`} element={<PlaylistPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
  </Routes>
)
