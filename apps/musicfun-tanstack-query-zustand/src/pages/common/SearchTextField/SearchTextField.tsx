import { TextField, type TextFieldProps } from '@/shared/components'
import { SearchIcon } from '@/shared/icons'

export const SearchTextField = (props: Omit<TextFieldProps, 'icon' | 'inputSize'>) => {
  return (
    <TextField
      {...props}
      icon={<SearchIcon width={20} height={20} />}
      inputSize="l"
      autoComplete="off"
    />
  )
}
