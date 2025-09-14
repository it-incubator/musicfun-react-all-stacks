import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFindTagsQuery } from '@/features/tags'
import { Autocomplete } from '@/shared/components'

export const PlaylistTagAutocomplete = ({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) => {
  const { t } = useTranslation()

  const [searchTerm, setSearchTerm] = useState('')
  const { data: tags } = useFindTagsQuery({ value: searchTerm })

  const options =
    tags?.map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) ?? []

  return (
    <Autocomplete
      label={t('tags.label')}
      value={value}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onChange={onChange}
      maxTags={5}
      options={options}
    />
  )
}
