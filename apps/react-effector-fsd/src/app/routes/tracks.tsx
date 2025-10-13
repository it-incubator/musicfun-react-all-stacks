import type { Route } from '@router/routes/+types/tracks'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Musicfun All Tracks' }]
}

export default function Tracks() {
  return <div>tracks</div>
}
