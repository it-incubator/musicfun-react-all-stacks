import { createFileRoute } from '@tanstack/react-router'
import { MyPlaylistsPage } from '@/pages/playlists/ui/my-playlists/my-playlists-page.tsx'
import { ROUTES } from '@/shared/routes/routes.ts'

export const Route = createFileRoute(ROUTES.myPlaylists)({
  component: MyPlaylistsPage,
})
