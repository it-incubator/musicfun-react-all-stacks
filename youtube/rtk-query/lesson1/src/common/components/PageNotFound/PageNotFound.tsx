import s from './PageNotFound.module.css'

export const PageNotFound = () => {
  return (
    <main className="page-shell">
      <div className="page-content">
        <section className={`${s.card} surface-card`}>
          <p className={s.eyebrow}>Lost in the catalog</p>
          <h1 className={s.title}>404</h1>
          <h2 className={s.subtitle}>Page not found</h2>
        </section>
      </div>
    </main>
  )
}
