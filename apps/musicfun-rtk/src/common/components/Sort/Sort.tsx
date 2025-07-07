import type { ChangeEvent } from 'react'

type Props = {
  sortDirection: 'asc' | 'desc'
  sortBy: 'addedAt' | 'likesCount'
  setSortBy: (direction: 'addedAt' | 'likesCount') => void
  setSortDirection: (direction: 'asc' | 'desc') => void
}

type Option = {
  label: string
  value: string
  sortBy: 'addedAt' | 'likesCount'
  sortDirection: 'asc' | 'desc'
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
