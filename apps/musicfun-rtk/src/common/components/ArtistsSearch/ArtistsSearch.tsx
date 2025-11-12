import { useEffect, useState } from 'react'
import { useDebounceValue } from '@/common/hooks'
import { AutoComplete, type Item } from '@/common/components/AutoComplete/AutoComplete.tsx'
import { useFindArtistsQuery } from '@/features/artists/api/artistsApi.ts'
import s from './ArtistsSearch.module.css'

type Props = {
  setValues: (tags: string[]) => void
  selectedIds: string[]
}

export const ArtistsSearch = ({ setValues, selectedIds }: Props) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)

  const [allArtists, setAllArtists] = useState<Item[]>([])

  const { data, isLoading } = useFindArtistsQuery(debouncedSearch)

  useEffect(() => {
    if (data) {
      setAllArtists((prev) => {
        const newItems = data.filter((item) => !prev.some((p) => p.id === item.id))
        return [...prev, ...newItems]
      })
    }
  }, [data])

  return (
    <div className={s.container}>
      <h2>Search by Artist</h2>
      <AutoComplete
        allItems={allArtists}
        placeholder={'Choose artists'}
        items={data || []}
        search={search}
        setSearch={setSearch}
        isPending={isLoading}
        setValues={setValues}
        selectedIds={selectedIds}
      />
    </div>
  )
}
