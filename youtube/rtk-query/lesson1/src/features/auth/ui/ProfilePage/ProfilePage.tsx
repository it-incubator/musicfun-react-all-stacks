import { Path } from '@/common/routing'
import { useGetMeQuery } from '@/features/auth/api/authApi.ts'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import { PlaylistsList } from '@/features/playlists/ui/PlaylistsList/PlaylistsList.tsx'
import { Navigate } from 'react-router'
import s from './ProfilePage.module.css'

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery(undefined)

  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery(
    { userId: meResponse?.userId },
    { skip: !meResponse?.userId },
  )

  if (isLoading || isMeLoading) {
    return (
      <main className="page-shell">
        <div className="page-content">
          <p className="empty-state">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />

  return (
    <main className="page-shell">
      <div className="page-content">
        <section className="page-hero">
          <div className="page-hero-grid">
            <div>
              <p className="page-eyebrow">Profile hub</p>
              <h1 className="page-title">
                {meResponse?.login}&rsquo;s <span className="page-title-accent">playlist studio</span>
              </h1>
              <p className="page-copy">
                Create fresh playlists, update existing ones, and keep your personal catalog in the same cinematic
                layout.
              </p>
            </div>

            <aside className="page-panel">
              <p className="page-panel-label">Library</p>
              <p className="page-panel-copy">
                {playlistsResponse?.meta.totalCount ?? 0} playlists belong to this account.
              </p>
              <p className="page-panel-copy">
                Use the form to create a new entry, then edit cards directly in the grid.
              </p>
            </aside>
          </div>
        </section>

        <section className="page-section" aria-labelledby="profile-playlists-title">
          <div className="page-section-head">
            <h2 id="profile-playlists-title" className="page-section-title">
              Your playlists
            </h2>
            <p className="page-section-text">Creation tools and your own cards live together in a single workspace.</p>
          </div>

          <div className={s.container}>
            <CreatePlaylistForm />
            <PlaylistsList isPlaylistsLoading={isLoading || isMeLoading} playlists={playlistsResponse?.data || []} />
          </div>
        </section>
      </div>
    </main>
  )
}
