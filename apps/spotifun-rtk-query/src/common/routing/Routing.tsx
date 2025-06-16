import { Route, Routes } from "react-router"
import { MainPage } from "@/app/MainPage.tsx"
import { PageNotFound } from "@/common/components"
import { PlaylistPage } from "@/features/playlists/ui/PlaylistPage/PlaylistPage.tsx"
import { TrackPage } from "@/features/tracks/ui/TrackPage/TrackPage.tsx"
import { AuthPage } from "@/features/auth/ui/AuthPage/AuthPage.tsx"
import { TracksPage } from "@/features/tracks/ui/TracksPage/TracksPage.tsx"

export const Path = {
  Main: "/",
  Auth: "/sign-in",
  Playlists: "/playlists",
  Tracks: "/tracks",
  OAuthRedirect: "/oauth/callback",
  NotFound: "*",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Auth} element={<AuthPage />} />
    <Route path={`${Path.Playlists}/:playlistId`} element={<PlaylistPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={`${Path.Tracks}/:trackId`} element={<TrackPage />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
    {/*<Route path={Path.Playlists} element={<PlaylistsPage />} />*/}
    {/*<Route path={Path.OAuthRedirect} element={<OAuthCallback />} />*/}
  </Routes>
)
