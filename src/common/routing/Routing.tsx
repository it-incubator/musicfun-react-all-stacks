import { Main } from "@/app/Main.tsx"
import { PageNotFound } from "@/common"
import { PlaylistPage } from "@/features/playlists/ui/PlaylistPage/PlaylistPage.tsx"
import { PlaylistsPage } from "@/features/playlists/ui/PlaylistsPage/PlaylistsPage.tsx"
import { TrackPage } from "@/features/tracks/ui/TrackPage/TrackPage.tsx"
import { TracksPage } from "@/features/tracks/ui/TracksPage/TracksPage.tsx"

import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
  Playlists: "/playlists",
  Tracks: "/tracks",
  NotFound: "*",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={`${Path.Playlists}/:playlistId`} element={<PlaylistPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={`${Path.Tracks}/:trackId`} element={<TrackPage />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)
