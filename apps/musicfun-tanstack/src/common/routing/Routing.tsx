import { Main } from '@/app/Main.tsx'
import { PageNotFound } from '@/common/components'
import { ArtistsPage } from '@/modules/musicstaff/artists/ui/ArtistsPage/ArtistsPage.tsx'
import { OAuthCallback } from '@/modules/auth/ui/OAuthRedirect/OAuthCallback.tsx'
import { ProfilePage } from '@/modules/auth/ui/ProfilePage/ProfilePage.tsx'
import { PlaylistPage } from '@/modules/musicstaff/playlists/ui/PlaylistPage/PlaylistPage.tsx'
import { PlaylistsPage } from '@/modules/musicstaff/playlists/ui/PlaylistsPage/PlaylistsPage.tsx'
import { TagsPage } from '@/modules/musicstaff/tags/ui/TagsPage/TagsPage.tsx'
import { TrackPage } from '@/modules/musicstaff/tracks/ui/TrackPage/TrackPage.tsx'
import { TracksPage } from '@/modules/musicstaff/tracks/ui/TracksPage/TracksPage.tsx'

import { Route, Routes } from 'react-router'

export const Path = {
  Main: '/',
  Playlists: '/playlists',
  Tracks: '/tracks',
  Artists: '/artists',
  Profile: '/profile',
  Tags: '/tags',
  OAuthRedirect: '/oauth/callback',
  NotFound: '*',
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
    <Route path={Path.Profile} element={<ProfilePage />} />
    <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)
