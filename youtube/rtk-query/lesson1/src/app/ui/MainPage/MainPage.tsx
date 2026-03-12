import { useGetMeQuery } from '@/features/auth/api/authApi.ts'
import s from './MainPage.module.css'

export const MainPage = () => {
  const { data } = useGetMeQuery(undefined)

  return (
    <main className="page-shell">
      <div className="page-content">
        <section className="page-hero">
          <div className="page-hero-grid">
            <div>
              <p className="page-eyebrow">Musicfun workspace</p>
              <h1 className="page-title">
                Everything for <span className="page-title-accent">tracks and playlists</span>
              </h1>
              <p className="page-copy">
                Move between the catalog, your profile, and playlist management inside one consistent interface built
                around covers, metadata, and fast playback access.
              </p>
            </div>

            <aside className="page-panel">
              <p className="page-panel-label">Session</p>
              <p className="page-panel-copy">{data ? `Signed in as ${data.login}` : 'You are browsing as a guest.'}</p>
              <p className="page-panel-copy">Use the navigation above to open tracks, playlists, or your profile.</p>
            </aside>
          </div>
        </section>

        <section className="page-section" aria-labelledby="main-overview-title">
          <div className="page-section-head">
            <h2 id="main-overview-title" className="page-section-title">
              Quick overview
            </h2>
            <p className="page-section-text">The home screen now follows the same visual system as Tracks Page.</p>
          </div>

          <div className={s.grid}>
            <article className={`${s.card} surface-card`}>
              <p className={s.cardKicker}>Tracks</p>
              <h3 className={s.cardTitle}>Cover-first discovery</h3>
              <p className={s.cardCopy}>
                Browse the track archive as cards with artwork, release details, and inline audio.
              </p>
            </article>

            <article className={`${s.card} surface-card`}>
              <p className={s.cardKicker}>Playlists</p>
              <h3 className={s.cardTitle}>Editable collections</h3>
              <p className={s.cardCopy}>Search, paginate, update covers, and manage playlist metadata from one page.</p>
            </article>

            <article className={`${s.card} surface-card`}>
              <p className={s.cardKicker}>Profile</p>
              <h3 className={s.cardTitle}>Personal library</h3>
              <p className={s.cardCopy}>Create new playlists and keep your own releases in the same design language.</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
