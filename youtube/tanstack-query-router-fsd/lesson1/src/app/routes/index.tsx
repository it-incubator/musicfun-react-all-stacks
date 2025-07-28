import { createFileRoute } from '@tanstack/react-router'
import { PlaylistsPage } from '../../pages/playlists-page.tsx'

export const Route = createFileRoute('/')({
  component: PlaylistsPage,
})
