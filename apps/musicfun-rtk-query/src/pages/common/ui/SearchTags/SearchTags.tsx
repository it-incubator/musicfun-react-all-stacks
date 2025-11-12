import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { useFindArtistsQuery } from '@/features/artists'
import { useFindTagsQuery } from '@/features/tags'
import { Autocomplete } from '@/shared/components'
import { useDebounce } from '@/shared/hooks'

type SearchType = 'tags' | 'artists'

type SearchTagsProps = {
  type: SearchType
  className?: string
  label?: string
  placeholder?: string
}

export const SearchTags = ({ type, className, label, placeholder }: SearchTagsProps) => {
  const { t } = useTranslation()

  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const paramKey = type === 'tags' ? 'tags' : 'artists'

  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    const initialItems = searchParams.get(paramKey)?.split(',').filter(Boolean) || []
    return initialItems
  })

  const { data: tagsData } = useFindTagsQuery(
    { value: debouncedSearchTerm },
    { skip: type !== 'tags' }
  )
  const { data: artistsData } = useFindArtistsQuery(debouncedSearchTerm, {
    skip: type !== 'artists',
  })

  const data = type === 'tags' ? tagsData : artistsData

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams)

    if (selectedItems.length > 0) {
      newSearchParams.set(paramKey, selectedItems.join(','))
    } else {
      newSearchParams.delete(paramKey)
    }

    setSearchParams(newSearchParams)
  }, [selectedItems, searchParams, setSearchParams, paramKey])

  const options =
    data?.map((item) => ({
      label: type === 'tags' ? item.name : item.name,
      value: item.id,
    })) || []

  const defaultLabel = type === 'tags' ? t('tags.label') : t('artists.label')
  const defaultPlaceholder = type === 'tags' ? t('tags.placeholder') : t('artists.placeholder')

  return (
    <Autocomplete
      options={options}
      value={selectedItems}
      onChange={setSelectedItems}
      label={label || defaultLabel}
      placeholder={placeholder || defaultPlaceholder}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      className={className}
    />
  )
}
