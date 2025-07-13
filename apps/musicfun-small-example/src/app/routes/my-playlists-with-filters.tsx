import { createFileRoute } from '@tanstack/react-router'
import { MyPlaylistsPage } from '@/pages/playlists/ui/my-playlists.page.tsx'

export const Route = createFileRoute('/my-playlists-with-filters')({
  component: MyPlaylistsPage,
})
