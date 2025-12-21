import { t } from 'i18next'
import { useSearchParams } from 'react-router'

import { Select, type SelectProps } from '@/shared/components'

import s from './SortSelect.module.css'

export const SortSelect = (props: Omit<SelectProps, 'options'>) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentSortBy = searchParams.get('sortBy') || 'addedAt'
  const currentSortDirection = searchParams.get('sortDirection') || 'desc'
  const currentValue = `${currentSortBy}_${currentSortDirection}`

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortDirection] = event.target.value.split('_')

    setSearchParams((prev) => {
      prev.set('sortBy', sortBy)
      prev.set('sortDirection', sortDirection)
      return prev
    })
  }

  return (
    <label className={s.selectLabel}>
      <span>{t('sort.label')}</span>
      <Select
        {...props}
        value={currentValue}
        onChange={handleSortChange}
        options={[
          { value: 'addedAt_desc', label: t('sort.newest_first') },
          { value: 'addedAt_asc', label: t('sort.oldest_first') },
          { value: 'likesCount_desc', label: t('sort.most_liked') },
          { value: 'likesCount_asc', label: t('sort.least_liked') },
        ]}
        className={s.select}
      />
    </label>
  )
}
