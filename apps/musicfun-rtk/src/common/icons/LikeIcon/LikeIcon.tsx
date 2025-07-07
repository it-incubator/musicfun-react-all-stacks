type Props = {
  width?: number
  height?: number
  fillColor?: string
  type?: 'like' | 'neutral'
}

export const LikeIcon = ({ width = 22, height = 21, fillColor = '#FF38B6', type = 'neutral' }: Props) => {
  const fill = type === 'like' ? fillColor : 'white'
  const stroke = type === 'like' ? fillColor : 'black'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 -1 24 24" fill="none">
      <path
        d="M11.401 2.04a6.137 6.137 0 0 1 8.654.248c2.375 2.47 2.457 6.402.248 8.967L11.399 20.5l-8.902-9.245C.288 8.69.371 4.75 2.745 2.288 5.123-.177 8.928-.26 11.401 2.04Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
