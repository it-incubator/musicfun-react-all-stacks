import { Select } from '@/common/shared'
import type { SelectProps } from '@/common/shared'

import s from './SortSelect.module.css'

export const SortSelect = (props: Omit<SelectProps, 'options'>) => {
  return (
    <label className={s.selectLabel}>
      Sort By
      <Select
        {...props}
        options={[
          { value: 'newest', label: 'Newest first' },
          { value: 'oldest', label: 'Oldest first' },
          { value: 'mostLiked', label: 'Most liked' },
          { value: 'leastLiked', label: 'Least liked' },
        ]}
        className={s.select}
      />
    </label>
  )
}
