type Props = {
  color?: string
  size?: number
}

export const HomeIcon = ({ size = 32, color = "currentColor" }: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.0001 7.58667L22.6667 13.5867V24H20.0001V16H12.0001V24H9.33341V13.5867L16.0001 7.58667ZM16.0001 4L2.66675 16H6.66675V26.6667H14.6667V18.6667H17.3334V26.6667H25.3334V16H29.3334L16.0001 4Z"
        fill={color}
      />
    </svg>
  )
}
