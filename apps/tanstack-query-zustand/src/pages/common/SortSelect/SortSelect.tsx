import { Select, type SelectProps } from '@/shared/components'
import { useTranslation } from 'react-i18next'

import s from './SortSelect.module.css'

export const SortSelect = (props: Omit<SelectProps, 'options'>) => {
  const { t } = useTranslation()

  return (
    <label className={s.selectLabel}>
      {t('sort.label')}
      <Select
        {...props}
        options={[
          {
            value: 'newest',
            label: t('sort.newest_first'),
          },
          {
            value: 'oldest',
            label: t('sort.oldest_first'),
          },
          {
            value: 'mostLiked',
            label: t('sort.most_liked'),
          },
          {
            value: 'leastLiked',
            label: t('sort.least_liked'),
          },
        ]}
        className={s.select}
      />
    </label>
  )
}
