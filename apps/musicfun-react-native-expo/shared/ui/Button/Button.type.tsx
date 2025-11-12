import { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native'

export type ButtonProps = PressableProps & {
  title: string
  buttonStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  isLoading?: boolean
  isFull?: boolean
  variant?: 'primary' | 'gray'
  disabled?: boolean
}
