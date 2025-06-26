import { Route, Routes } from "react-router"
import { ArtistsPage } from "@/features/artists/ui/ArtistsPage/ArtistsPage.tsx"
import { TagsPage } from "@/features/tags/ui/TagsPage/TagsPage.tsx"
import { MainPage } from "@/app/ui/MainPage.tsx"
import { PageNotFound } from "@/common/components"
import { PlaylistPage } from "@/features/playlists/ui/PlaylistPage/PlaylistPage.tsx"
import { TrackPage } from "@/features/tracks/ui/TrackPage/TrackPage.tsx"
import { TracksPage } from "@/features/tracks/ui/TracksPage/TracksPage.tsx"
import { OAuthCallback } from "@/features/auth/ui/OAuthRedirect/OAuthCallback.tsx"
import { PlaylistsPage } from "@/features/playlists/ui/PlaylistsPage/PlaylistsPage.tsx"
import { ProfilePage } from "@/features/auth/ui/ProfilePage/ProfilePage.tsx"
import { Library } from "@/features/library/Library.tsx"

export const Path = {
  Main: "/",
  Auth: "/sign-in",
  Playlists: "/playlists",
  Profile: "/profile",
  Tracks: "/tracks",
  OAuthRedirect: "/oauth/callback",
  Artists: "/artists",
  Tags: "/tags",
  Library: "/library",
  NotFound: "*",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={`${Path.Playlists}/:playlistId`} element={<PlaylistPage />} />
    <Route path={Path.Profile} element={<ProfilePage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={`${Path.Tracks}/:trackId`} element={<TrackPage />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
    <Route path={Path.Artists} element={<ArtistsPage />} />
    <Route path={Path.Tags} element={<TagsPage />} />
    <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
    <Route path={Path.Library} element={<Library />} />
    {/* <Route path={Path.Auth} element={<AuthPage />} /> */}
  </Routes>
)
