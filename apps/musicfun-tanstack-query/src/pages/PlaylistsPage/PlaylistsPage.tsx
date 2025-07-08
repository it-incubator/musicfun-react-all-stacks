import { useState } from 'react'

import { MOCK_PLAYLISTS, PlaylistCard } from '@/features/playlists'
import { MOCK_HASHTAGS } from '@/features/tags'
import { Autocomplete, Pagination, Typography } from '@/shared/components'

import { ContentList, PageWrapper, SearchTextField, SortSelect } from '../common'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const [hashtags, setHashtags] = useState<string[]>([])

  return (
    <PageWrapper>
      <Typography variant="h2" as="h1" className={s.title}>
        All Playlists
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField placeholder="Search playlists" onChange={() => {}} />
          <SortSelect onChange={() => {}} />
        </div>
        <Autocomplete
          options={MOCK_HASHTAGS.map((hashtag) => ({
            label: hashtag,
            value: hashtag,
          }))}
          value={hashtags}
          onChange={setHashtags}
          label="Hashtags"
          placeholder="Search by hashtags"
          className={s.autocomplete}
        />
      </div>
      <ContentList
        data={[...MOCK_PLAYLISTS, ...MOCK_PLAYLISTS, ...MOCK_PLAYLISTS]}
        renderItem={(playlist) => (
          <PlaylistCard
            id={playlist.data.id}
            title={playlist.data.attributes.title}
            image={playlist.data.attributes.images.main[0].url}
            description={playlist.data.attributes.description.text}
            isShowReactionButtons={true}
            reaction={playlist.data.attributes.currentUserReaction}
            onLike={() => {}}
            onDislike={() => {}}
            likesCount={playlist.data.attributes.likesCount}
          />
        )}
      />
      <Pagination className={s.pagination} page={1} pagesCount={10} onPageChange={() => {}} />
    </PageWrapper>
  )
}
