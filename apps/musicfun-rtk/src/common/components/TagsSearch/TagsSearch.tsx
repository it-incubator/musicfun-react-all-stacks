import { useFindTagsQuery } from '@/features/tags/api/tagsApi.ts'
import { useEffect, useState } from 'react'
import { useDebounceValue } from '@/common/hooks'
import s from './TagsSearch.module.css'
import { AutoComplete, type Item } from '@/common/components/AutoComplete/AutoComplete.tsx'

type Props = {
  setValues: (tags: string[]) => void
  selectedIds: string[]
}

export const TagsSearch = ({ setValues, selectedIds }: Props) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)

  const [allTags, setAllTags] = useState<Item[]>([])

  const { data, isLoading } = useFindTagsQuery({ value: debouncedSearch })

  useEffect(() => {
    if (data) {
      setAllTags((prev) => {
        const newItems = data.filter((item) => !prev.some((p) => p.id === item.id))
        return [...prev, ...newItems]
      })
    }
  }, [data])

  return (
    <div className={s.container}>
      <h2>Search by Tag</h2>
      <AutoComplete
        allItems={allTags || []}
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
