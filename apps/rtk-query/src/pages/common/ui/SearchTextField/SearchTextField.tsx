import { useSearchParams } from 'react-router'

import { TextField, type TextFieldProps } from '@/shared/components'
import { SearchIcon } from '@/shared/icons'

export const SearchTextField = (props: Omit<TextFieldProps, 'icon' | 'inputSize'>) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      if (e.target.value === '') {
        prev.delete('search')
      } else {
        prev.set('search', e.target.value)
        prev.set('page', '1')
      }

      return prev
    })
  }

  const search = searchParams.get('search') || ''

  return (
    <TextField
      {...props}
      value={search}
      onChange={handleChange}
      icon={<SearchIcon width={20} height={20} />}
      inputSize="l"
      autoComplete="off"
    />
  )
}
