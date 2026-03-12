import { useInfiniteScroll } from '@/common/hooks'
import { useFetchTracksInfiniteQuery } from '@/features/tracks/api/tracksApi.ts'
import { LoadingTrigger } from '@/features/tracks/ui/LoadingTrigger/LoadingTrigger.tsx'
import { TracksList } from '@/features/tracks/ui/TracksList/TracksList.tsx'
import s from './TracksPage.module.css'

export const TracksPage = () => {
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } = useFetchTracksInfiniteQuery()

  const { observerRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetching })

  const pages = data?.pages.flatMap((page) => page.data) || []

  return (
    <main className={s.page}>
      <div className={s.shell}>
        <section className={s.hero}>
          <div className={s.heroContent}>
            <div>
              <p className={s.eyebrow}>Musicfun archive</p>
              <h1 className={s.title}>
                Find your next <span className={s.accent}>favorite track</span>
              </h1>
              <p className={s.description}>
                Start with any cover that catches your eye, open the built-in player, and explore the catalog in a calm,
                cinematic flow designed for very different tastes.
              </p>
            </div>

            <aside className={s.heroAside}>
              <p className={s.asideLabel}>How it works</p>
              <p className={s.asideText}>
                Browse covers, read the track details, and play audio directly from each tile.
              </p>
              <p className={s.asideText}>Scroll down to automatically load more releases without leaving the page.</p>
            </aside>
          </div>
        </section>

        <section className={s.content} aria-labelledby="tracks-list-title">
          <div className={s.sectionHead}>
            <h2 id="tracks-list-title" className={s.sectionTitle}>
              Tracks in focus
            </h2>
            <p className={s.sectionText}>
              A spacious, cover-led view built to keep playback controls and metadata readable on every screen.
            </p>
          </div>

          <TracksList tracks={pages} />
        </section>

        <div className={s.status}>
          {hasNextPage && <LoadingTrigger isFetchingNextPage={isFetchingNextPage} observerRef={observerRef} />}
          {!hasNextPage && pages.length > 0 && <p className={s.statusText}>Nothing more to load</p>}
        </div>
      </div>
    </main>
  )
}
