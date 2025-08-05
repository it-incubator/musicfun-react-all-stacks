import { useState } from 'react'

import { Autocomplete } from '@/shared/components'

import { useFindArtistsQuery } from '../../api'

export const ArtistsTagAutocomplete = ({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: tags } = useFindArtistsQuery(searchTerm)

  const options =
    tags?.map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) ?? []

  return (
    <Autocomplete
      label="Artists"
      value={value}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onChange={onChange}
      maxTags={5}
      options={options}
    />
  )
}
