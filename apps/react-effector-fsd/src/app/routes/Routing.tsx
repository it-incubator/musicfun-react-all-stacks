import { Route, Routes } from 'react-router'

import { Layout } from '@/widgets/layout'
import { UserPage } from '@/pages/user'
import { Home } from '@/pages/home'

export const Routing = () => (
  <Routes>
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
