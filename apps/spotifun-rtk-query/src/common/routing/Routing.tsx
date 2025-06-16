import { Main } from "@/app/Main.tsx";
import { PageNotFound } from "@/common/components/PageNotFound/PageNotFound.tsx";
import { TracksPage } from "@/features/tracks/ui/TracksPage/TracksPage.tsx";
import { Route, Routes } from "react-router";

export const Path = {
  Main: "/",
  Playlists: "/playlists",
  Tracks: "/tracks",
  Artists: "/artists",
  Tags: "/tags",
  OAuthRedirect: "/oauth/callback",
  NotFound: "*",
} as const;

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    {/*<Route path={Path.Playlists} element={<PlaylistsPage />} />*/}
    {/*<Route path={`${Path.Playlists}/:playlistId`} element={<PlaylistPage />} />*/}
    <Route path={Path.Tracks} element={<TracksPage />} />
    {/*<Route path={`${Path.Tracks}/:trackId`} element={<TrackPage />} />*/}
    {/*<Route path={Path.Artists} element={<ArtistsPage />} />*/}
    {/*<Route path={Path.Tags} element={<TagsPage />} />*/}
    {/*<Route path={Path.OAuthRedirect} element={<OAuthCallback />} />*/}
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
);
