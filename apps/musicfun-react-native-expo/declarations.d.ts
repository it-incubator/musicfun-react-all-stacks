declare module '*.svg' {
  import type { SvgProps } from 'react-native-svg'
  import type { FunctionComponent } from 'react'
  const content: FunctionComponent<SvgProps>
  export default content
}
