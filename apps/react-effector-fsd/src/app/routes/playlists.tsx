import type { Route } from '@router/routes/+types/playlists'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Musicfun All Playlists' }]
}

export default function Playlists() {
  return <div>playlists</div>
}
