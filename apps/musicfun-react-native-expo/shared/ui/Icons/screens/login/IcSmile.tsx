import * as React from 'react'
import Svg, { SvgProps, Circle, Ellipse, Path } from 'react-native-svg'

export const IcSmile = ({ width = 89, height = 89, ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 89 89" fill="none" {...props}>
    <Circle cx={44.5} cy={44.5} r={44.5} fill="#FF38B6" />
    <Ellipse cx={58.865} cy={26.477} rx={8.431} ry={10.902} fill="#fff" />
    <Ellipse cx={57.992} cy={28.949} rx={3.198} ry={4.07} fill="#000" />
    <Ellipse cx={29.791} cy={26.477} rx={8.431} ry={10.902} fill="#fff" />
    <Ellipse cx={31.826} cy={28.949} rx={3.198} ry={4.07} fill="#000" />
    <Path
      d="M64.915 69.503C54.958 80.1 35.6 80.1 24.03 68.816"
      stroke="#fff"
      strokeWidth={6.154}
      strokeLinecap="round"
    />
    <Path
      d="M71.31 49.806C58.385 63.56 33.261 63.56 18.244 48.914"
      stroke="#fff"
      strokeWidth={7.987}
      strokeLinecap="round"
    />
  </Svg>
)
