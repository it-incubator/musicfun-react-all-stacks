import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

export const IcAllPlaylist = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#fff"
      d="M27 0H3A2.675 2.675 0 0 0 .333 2.667v18.666C.333 22.8 1.533 24 3 24h24c1.467 0 2.667-1.2 2.667-2.667V2.667C29.667 1.2 28.467 0 27 0Zm0 21.333H3V2.667h24v18.666ZM9.667 16c0-2.213 1.786-4 4-4 .466 0 .92.093 1.333.24V4h6.667v2.667h-4v9.373a4.003 4.003 0 0 1-4 3.96c-2.214 0-4-1.787-4-4Z"
    />
  </Svg>
)
