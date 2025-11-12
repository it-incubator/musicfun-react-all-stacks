import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

export const IcHome = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#fff"
      d="m13.5 3.587 6.667 6V20H17.5v-8h-8v8H6.833V9.587l6.667-6ZM13.5 0 .167 12h4v10.667h8v-8h2.666v8h8V12h4L13.5 0Z"
    />
  </Svg>
)
