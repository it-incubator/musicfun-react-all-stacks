import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { useState } from 'react'
import { Navigate } from '@tanstack/react-router'
import { AddPlaylistForm } from '@/features/playlists/add-playlist-form/add-playlist-form.tsx'
import { EditPlaylistForm } from '@/features/playlists/edit-playlist-form/edit-playlist-form.tsx'
import { PaginatedPlaylists } from '@/features/playlists/list/paginated-playlists.tsx'
import styles from './my-playlists-page.module.css'

export function MyPlaylistsPage() {
  const { data, isLoading } = useMeQuery()
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

  if (isLoading) return <span>loading...</span>

  if (!data) {
    // acts like React-Router’s <Navigate> / Next.js <Redirect>
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <h3>My Playlists</h3>
      <AddPlaylistForm />
      <div className={styles.playlistsBox}>
        <PaginatedPlaylists
          onPlaylistSelected={setEditingPlaylistId}
          userId={data.userId}
          classNames={styles.playlistColumn}
        />
        <EditPlaylistForm
          playlistId={editingPlaylistId}
          onCancelEditing={() => setEditingPlaylistId(null)}
          classNames={styles.editFormColumn}
        />
      </div>
    </div>
  )
}
