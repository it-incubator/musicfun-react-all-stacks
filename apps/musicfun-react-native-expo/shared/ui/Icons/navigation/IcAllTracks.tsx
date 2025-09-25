import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

export const IcAllTracks = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#fff"
      d="m8.5 0 .013 14.067a5.329 5.329 0 0 0-2.666-.734A5.335 5.335 0 0 0 .5 18.667 5.335 5.335 0 0 0 5.847 24c2.96 0 5.32-2.387 5.32-5.333V5.333H16.5V0h-8ZM5.847 21.333a2.674 2.674 0 0 1-2.667-2.666C3.18 17.2 4.38 16 5.847 16c1.466 0 2.666 1.2 2.666 2.667 0 1.466-1.2 2.666-2.666 2.666Z"
    />
  </Svg>
)
