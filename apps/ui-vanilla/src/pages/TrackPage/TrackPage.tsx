import { MOCK_PLAYLISTS, PlaylistCard } from '@/features/playlists'
import { TrackOverview } from '@/features/tracks'
import { Pagination, SearchField, Typography } from '@/shared/components'

import { ContentList, PageWrapper } from '../common'
import s from './TrackPage.module.css'
import { ControlPanel } from './ui/ControlPanel'

export const TrackPage = () => {
  return (
    <PageWrapper className={s.trackPage}>
      <TrackOverview
        className={s.trackOverview}
        title="Chill Mix"
        image="https://unsplash.it/297/297"
        releaseDate="2025-01-01"
        artists={['Julia Wolf', 'ayokay', 'Khalid']}
        tags={['chill', 'mood', 'relax']}
      />

      <ControlPanel />

      <Typography variant="h2" className={s.title}>
        In which playlist is the track?
      </Typography>

      <SearchField placeholder="Search playlists" className={s.search} />

      <ContentList
        data={[...MOCK_PLAYLISTS]}
        renderItem={(playlist) => (
          <PlaylistCard
            id={playlist.data.id}
            title={playlist.data.attributes.title}
            image={playlist.data.attributes.images.main[0].url}
            description={playlist.data.attributes.description.text}
          />
        )}
      />
      <Pagination className={s.pagination} page={1} pagesCount={2} onPageChange={() => {}} />
    </PageWrapper>
  )
}
