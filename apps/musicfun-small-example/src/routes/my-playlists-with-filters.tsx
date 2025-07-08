import { createFileRoute, Navigate } from '@tanstack/react-router'
import { PaginatedPlaylists } from '../features/playlists/list/paginated-playlists.tsx'
import { useMeQuery } from '../features/auth/api/use-me.query.ts'
import { AddPlaylistForm } from '../features/playlists/add-playlist-form/add-playlist-form.tsx'
import { EditPlaylistForm } from '../features/playlists/edit-playlist-form/edit-playlist-form.tsx'
import { useState } from 'react'

export const Route = createFileRoute('/my-playlists-with-filters')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useMeQuery()
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

  if (isLoading) return <span>loading...</span>

  if (!data?.data) {
    // acts like React-Router’s <Navigate> / Next.js <Redirect>
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <h3>My Playlists</h3>
      <hr />
      <AddPlaylistForm />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <EditPlaylistForm playlistId={editingPlaylistId} onCancelEditing={() => setEditingPlaylistId(null)} />

        <PaginatedPlaylists onPlaylistSelected={setEditingPlaylistId} userId={data.data!.userId} />
      </div>
    </div>
  )
}
