import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { artistsKey } from '@/common/apiEntities'
import { SearchInput } from '@/common/components'
import { useDebounceValue } from '@/common/hooks'
import { artistsApi } from '../../../api/artistsApi.ts'
import { ArtistItem } from './ArtistItem/ArtistItem.tsx'

export const ArtistsList = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)

  const { data, isPending } = useQuery({
    queryKey: [artistsKey, debouncedSearch],
    queryFn: () => artistsApi.findArtists(debouncedSearch),
  })

  return (
    <>
      <SearchInput search={search} setSearch={setSearch} isPending={isPending} placeholder="Введите имя" />
      {Array.isArray(data?.data) && data.data.length ? (
        <div>
          <h2>Список артистов</h2>
          {data?.data.map((artist) => {
            return <ArtistItem artist={artist} key={artist.id} />
          })}
        </div>
      ) : (
        <h2>По заданному условию артисты не найдены. Измените параметры поиска</h2>
      )}
    </>
  )
}
