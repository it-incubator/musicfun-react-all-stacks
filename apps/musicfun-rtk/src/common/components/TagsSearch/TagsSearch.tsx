import { useFindTagsQuery } from '@/features/tags/api/tagsApi.ts'
import { useState } from 'react'
import { useDebounceValue } from '@/common/hooks'
import s from './TagsSearch.module.css'
import { AutoComplete } from '@/common/components/AutoComplete/AutoComplete.tsx'

type Props = {
  setValues: (tags: string[]) => void
  selectedIds: string[]
}

export const TagsSearch = ({ setValues, selectedIds }: Props) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)
  const { data, isLoading } = useFindTagsQuery({ value: debouncedSearch })

  return (
    <div className={s.container}>
      <h2>Поиск по тегу</h2>
      <AutoComplete
        placeholder={'Choose tag'}
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
