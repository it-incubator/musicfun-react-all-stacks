import { Route, Routes } from 'react-router'

import { OAuthCallback } from '@/features/auth'
import { Layout } from '@/layout'
import { MainPage, PlaylistPage, PlaylistsPage, TrackPage, TracksPage, UserPage } from '@/pages'
import { Paths } from '@/shared/configs'

export const Routing = () => (
  <Routes>
    <Route path={Paths.Main} element={<Layout />}>
      <Route index element={<MainPage />} />

      <Route path={Paths.Tracks} element={<TracksPage />} />
      <Route path={`${Paths.Tracks}/:id`} element={<TrackPage />} />

      <Route path={Paths.Playlists} element={<PlaylistsPage />} />
      <Route path={`${Paths.Playlists}/:id`} element={<PlaylistPage />} />

      <Route path={`${Paths.Profile}/:userId`} element={<UserPage />} />

      <Route path={Paths.OAuthRedirect} element={<OAuthCallback />} />
    </Route>
  </Routes>
)
