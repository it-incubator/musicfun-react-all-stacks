import { useState } from 'react'
import { useDebounceValue } from '@/common/hooks'
import { AutoComplete } from '@/common/components/AutoComplete/AutoComplete.tsx'
import { useFindArtistsQuery } from '@/features/artists/api/artistsApi.ts'
import s from './ArtistsSearch.module.css'

type Props = {
  setValues: (tags: string[]) => void
  selectedIds: string[]
}

export const ArtistsSearch = ({ setValues, selectedIds }: Props) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)
  const { data, isLoading } = useFindArtistsQuery(debouncedSearch)

  return (
    <div className={s.container}>
      <h2>Поиск по артисту</h2>
      <AutoComplete
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
