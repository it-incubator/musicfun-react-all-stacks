import { useState } from 'react'

import { Autocomplete } from '@/shared/components'

import { useFindTagsQuery } from '../../api/tagsApi'

export const PlaylistTagAutocomplete = ({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: tags } = useFindTagsQuery({ value: searchTerm })

  const options =
    tags?.map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) ?? []

  return (
    <Autocomplete
      label="Hashtags"
      value={value}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onChange={onChange}
      maxTags={5}
      options={options}
    />
  )
}
