import { createFileRoute } from '@tanstack/react-router'
import { PlaylistsWithFiltersPage } from '@/pages/playlists/ui/playlists-with-filters-page.tsx'

export const Route = createFileRoute('/playlists-with-filters')({
  component: PlaylistsWithFiltersPage,
})
