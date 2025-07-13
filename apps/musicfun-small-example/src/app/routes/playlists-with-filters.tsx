import { createFileRoute } from '@tanstack/react-router'
import { PaginatedPlaylists } from '../../features/playlists/list/paginated-playlists.tsx'

export const Route = createFileRoute('/playlists-with-filters')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PaginatedPlaylists />
    </div>
  )
}
