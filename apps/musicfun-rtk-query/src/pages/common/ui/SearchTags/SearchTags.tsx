import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { useFindTagsQuery } from '@/features/tags'
import { Autocomplete } from '@/shared/components'
import { useDebounce } from '@/shared/hooks'

export const SearchTags = ({ className }: { className?: string }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const [tags, setTags] = useState<string[]>(() => {
    const initialTags = searchParams.get('tags')?.split(',').filter(Boolean) || []

    return initialTags
  })

  const { data } = useFindTagsQuery({ value: debouncedSearchTerm })

  // Обновляем URL при изменении тегов
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams)

    if (tags.length > 0) {
      newSearchParams.set('tags', tags.join(','))
    } else {
      newSearchParams.delete('tags')
    }

    setSearchParams(newSearchParams)
  }, [tags, searchParams, setSearchParams])

  const options =
    data?.map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) || []

  return (
    <Autocomplete
      options={options}
      value={tags}
      onChange={setTags}
      label="Hashtags"
      placeholder="Search by hashtags"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      className={className}
    />
  )
}
