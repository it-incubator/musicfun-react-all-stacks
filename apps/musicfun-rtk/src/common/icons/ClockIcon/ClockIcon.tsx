type Props = {
  width?: number
  height?: number
  fillColor?: string
}

export const ClockIcon = ({ width = 28, height = 29, fillColor = '#FF38B6' }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 28 28" fill="none">
      <g clipPath="url(#clip0_24878_2100)">
        <path
          d="M14 3C20.0751 3 25 7.92487 25 14C25 20.0751 20.0751 25 14 25C7.92487 25 3 20.0751 3 14C3 7.92487 7.92487 3 14 3ZM14 5C9.02944 5 5 9.02944 5 14C5 18.9706 9.02944 23 14 23C18.9706 23 23 18.9706 23 14C23 9.02944 18.9706 5 14 5ZM14.5 13.5H18V15.5H12.5V8.5H14.5V13.5Z"
          fill={fillColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_24878_2100">
          <rect width="28" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
