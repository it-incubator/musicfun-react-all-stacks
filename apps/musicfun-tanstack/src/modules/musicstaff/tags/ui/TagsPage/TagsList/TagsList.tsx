import { tagsKey } from '@/common/apiEntities'
import { SearchInput } from '@/common/components'
import { useDebounceValue } from '@/common/hooks'
import { tagsApi } from '../../../api/tagsApi.ts'
import { TagItem } from './TagItem/TagItem.tsx'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const TagsList = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search)

  const { data, isPending } = useQuery({
    queryKey: [tagsKey, debouncedSearch],
    queryFn: () => tagsApi.findTags(debouncedSearch),
  })

  return (
    <>
      <SearchInput search={search} setSearch={setSearch} isPending={isPending} placeholder="Введите тег" />
      {Array.isArray(data?.data) && data.data.length ? (
        <div>
          <h2>Список тегов</h2>
          {data?.data.map((tag) => {
            return <TagItem tag={tag} key={tag.id} />
          })}
        </div>
      ) : (
        <h2>По заданному условию теги не найдены. Измените параметры поиска</h2>
      )}
    </>
  )
}
