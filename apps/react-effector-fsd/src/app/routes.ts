import { type RouteConfig, index, route, layout } from '@react-router/dev/routes'

export default [
  layout('./layout.tsx', [
    index('routes/home.tsx'),
    route('user/:id', 'routes/user.$id.tsx'),
    route('tracks', 'routes/tracks.tsx'),
    route('playlists', 'routes/playlists.tsx'),
  ]),
] satisfies RouteConfig
