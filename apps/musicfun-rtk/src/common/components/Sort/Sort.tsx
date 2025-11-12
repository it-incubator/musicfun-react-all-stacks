import type { ChangeEvent } from 'react'
import type { SortBy, SortDirection } from '@/common/types'

type Props = {
  sortDirection: SortDirection
  sortBy: SortBy
  setSortBy: (direction: SortBy) => void
  setSortDirection: (direction: SortDirection) => void
}

type Option = {
  label: string
  value: string
  sortBy: SortBy
  sortDirection: SortDirection
}

const options: Option[] = [
  {
    label: 'Newest first',
    value: 'desc',
    sortBy: 'addedAt',
    sortDirection: 'desc',
  },
  {
    label: 'Oldest first',
    value: 'asc',
    sortBy: 'addedAt',
    sortDirection: 'asc',
  },
  {
    label: 'Top-rated first',
    value: 'likesCount',
    sortBy: 'likesCount',
    sortDirection: 'desc',
  },
]

export const Sort = ({ setSortDirection, setSortBy, sortDirection, sortBy }: Props) => {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = options.find((o) => o.value === e.target.value)
    if (selected) {
      setSortBy(selected.sortBy)
      setSortDirection(selected.sortDirection)
    }
  }

  const value = sortBy === 'likesCount' ? sortBy : sortDirection

  return (
    <div>
      <label>Sorted by </label>
      <select value={value} onChange={onChangeHandler}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
