import {
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form'

import { TextField, type TextFieldProps } from '@/shared/components'

type FormControlledTextFieldProps<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  rules?: RegisterOptions<T, FieldPath<T>>
} & Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref'>

export const FormControlledTextField = <T extends FieldValues>({
  name,
  control,
  rules,
  ...rest
}: FormControlledTextFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules })

  return <TextField {...field} {...rest} errorMessage={error?.message} />
}
