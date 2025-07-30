import { useState } from 'react'
import { SearchInput } from '@/common/components'
import { useDebounceValue } from '@/common/hooks'
import { ArtistItem } from './ArtistItem/ArtistItem.tsx'
import { useFindArtistsQuery } from '../../../api/artistsApi.ts'

export const ArtistsList = () => {
  const [search, setSearch] = useState('')

  const [debouncedSearch] = useDebounceValue(search)
  const { data, isLoading } = useFindArtistsQuery(debouncedSearch)

  const isPending = isLoading || search !== debouncedSearch

  return (
    <>
      <SearchInput
        search={search}
        setSearch={setSearch}
        isPending={isPending}
        title="Search by Artist Name"
        placeholder="Enter name"
      />
      {Array.isArray(data) && data.length ? (
        <div>
          <h2>Artists List</h2>
          {data.map((artist) => {
            return <ArtistItem artist={artist} key={artist.id} />
          })}
        </div>
      ) : (
        <h2>No artists found for the given criteria. Change search parameters</h2>
      )}
    </>
  )
}
