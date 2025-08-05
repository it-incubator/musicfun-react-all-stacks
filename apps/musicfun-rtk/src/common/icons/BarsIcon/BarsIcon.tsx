type Props = {
  color?: string
  size?: number
}

export const BarsIcon = ({ color = '#FF38B6', size = 28 }: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 28 28" fill="none">
    <g clip-path="url(#clip0_24878_2110)">
      <rect x="6" y="5" width="3" height="18" fill={color} />
      <rect x="10" y="19" width="3" height="4" fill={color} />
      <rect x="14" y="9" width="3" height="14" fill={color} />
      <rect x="18" y="19" width="3" height="4" fill={color} />
    </g>
    <defs>
      <clipPath id="clip0_24878_2110">
        <rect width="28" height="28" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
