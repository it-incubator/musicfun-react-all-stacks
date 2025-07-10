import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { PlaylistCard, useFetchPlaylistsQuery } from '@/features/playlists'
import { MOCK_HASHTAGS } from '@/features/tags'
import { Autocomplete, Pagination, Typography } from '@/shared/components'

import { ContentList, PageWrapper, SearchTextField, SortSelect } from '../common'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const [hashtags, setHashtags] = useState<string[]>([])
  const [searchParams, setSearchParams] = useSearchParams()

  const pageNumber = Number(searchParams.get('page')) || 1
  const { data: playlists } = useFetchPlaylistsQuery({ pageNumber })
  const pagesCount = playlists?.meta.pagesCount || 1

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      if (page === 1) {
        prev.delete('page')
      } else {
        prev.set('page', page.toString())
      }
      return prev
    })
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
      {playlists?.data && (
        <ContentList
          data={playlists.data}
          renderItem={(playlist) => {
            const image = playlist.attributes.images.main[1]

            return (
              <PlaylistCard
                id={playlist.id}
                title={playlist.attributes.title}
                imageSrc={image?.url}
                description={playlist.attributes.description}
                isShowReactionButtons={true}
                reaction={playlist.attributes.currentUserReaction}
                likesCount={playlist.attributes.likesCount}
              />
            )
          }}
        />
      )}
      <Pagination
        className={s.pagination}
        page={pageNumber}
        pagesCount={pagesCount}
        onPageChange={handlePageChange}
      />
    </PageWrapper>
  )
}
