import { useState } from 'react'

import { PlaylistCard } from '@/features/playlists'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query.ts'
import { MOCK_HASHTAGS } from '@/features/tags'
import { Autocomplete, Pagination, Typography } from '@/shared/components'

import { ContentList, PageWrapper, SearchTextField, SortSelect } from '../common'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const [hashtags, setHashtags] = useState<string[]>([])

  const { data, isPending, isError } = usePlaylists({
    pageNumber: 1,
  })

  let content

  if (isPending) {
    content = <span>Loading...</span>
  }

  if (isError) {
    content = <span>Loading...</span>
  }

  if (!isPending && !isError) {
    content = (
      <>
        <ContentList
          data={data.data!.data}
          renderItem={(playlist) => (
            <PlaylistCard
              id={playlist.id}
              title={playlist.attributes.title}
              images={playlist.attributes.images}
              description={playlist.attributes.description}
              isShowReactionButtons={true}
              reaction={playlist.attributes.currentUserReaction}
              onLike={() => {}}
              onDislike={() => {}}
              likesCount={playlist.attributes.likesCount}
            />
          )}
        />
        <Pagination className={s.pagination} page={1} pagesCount={10} onPageChange={() => {}} />
      </>
    )
  }

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
      {content}
    </PageWrapper>
  )
}
