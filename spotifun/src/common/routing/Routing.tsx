import { Main } from "@/app/Main.tsx"
import { PageNotFound } from "@/common/components"
import { ArtistsPage } from "@/features/artists/ui/ArtistsPage/ArtistsPage.tsx"
import { DndPage } from "@/features/dnd/DndPage/DndPage.tsx"
import { PlaylistPage } from "@/features/playlists/ui/PlaylistPage/PlaylistPage.tsx"
import { PlaylistsPage } from "@/features/playlists/ui/PlaylistsPage/PlaylistsPage.tsx"
import { TagsPage } from "@/features/tags/ui/TagsPage/TagsPage.tsx"
import { TrackPage } from "@/features/tracks/ui/TrackPage/TrackPage.tsx"
import { TracksPage } from "@/features/tracks/ui/TracksPage/TracksPage.tsx"

import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
  Playlists: "/playlists",
  Tracks: "/tracks",
  Artists: "/artists",
  Tags: "/tags",
  Dnd1: "/dnd1",
  NotFound: "*",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={`${Path.Playlists}/:playlistId`} element={<PlaylistPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={`${Path.Tracks}/:trackId`} element={<TrackPage />} />
    <Route path={Path.Artists} element={<ArtistsPage />} />
    <Route path={Path.Tags} element={<TagsPage />} />
    <Route path={Path.Dnd1} element={<DndPage />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)
