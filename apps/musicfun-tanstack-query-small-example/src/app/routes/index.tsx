import { createFileRoute } from '@tanstack/react-router'
import { Playlists } from '../../features/playlists/list/playlists.tsx'

export const Route = createFileRoute('/')({
  component: () => <Playlists filtersEnabled={false} />,
})
