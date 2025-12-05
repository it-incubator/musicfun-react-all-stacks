import { Route, Routes } from 'react-router'

import { OAuthCallback } from '@/pages/auth/OAuthRedirect/OAuthCallback.tsx'
import { Home } from '@/pages/home'
import { UserPage } from '@/pages/user'
import { Layout } from '@/widgets/layout'

export const Routing = () => (
  <Routes>
    <Route path="/oauth/callback" element={<OAuthCallback />} />
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />

      {/*<Route path="/tracks" element={<TracksPage />} />*/}
      {/*<Route path="/tracks/:id" element={<TrackPage />} />*/}

      {/*<Route path="/playlists" element={<PlaylistsPage />} />*/}
      {/*<Route path="/playlists/:id" element={<PlaylistPage />} />*/}

      <Route path="/user/:id" element={<UserPage />} />
    </Route>
  </Routes>
)
