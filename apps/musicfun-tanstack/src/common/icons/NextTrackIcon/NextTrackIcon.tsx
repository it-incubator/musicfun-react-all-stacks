type Props = {
  color?: string
  size?: number
  type: 'next' | 'prev'
}

export const NextTrackIcon = ({ color = '#fff', size = 30, type }: Props) => {
  const transform = type === 'prev' ? 'scaleX(-1)' : undefined

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color}
        viewBox="0 0 24 24"
        style={{ transform }}
      >
        <path
          fill={color}
          d="M16.66 14.647c1.787-1.154 1.787-4.14 0-5.294L5.87 2.385C4.135 1.264 2 2.724 2 5.033v13.934c0 2.31 2.134 3.769 3.87 2.648zM22.75 5a.75.75 0 0 0-1.5 0v14a.75.75 0 0 0 1.5 0z"
        ></path>
      </svg>
    </div>
  )
}
