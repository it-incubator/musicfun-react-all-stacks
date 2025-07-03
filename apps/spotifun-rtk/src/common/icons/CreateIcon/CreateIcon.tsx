type Props = {
  color?: string
  size?: number
}

export const CreateIcon = ({ size = 32, color = "currentColor" }: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.0001 2.6665C8.64008 2.6665 2.66675 8.63984 2.66675 15.9998C2.66675 23.3598 8.64008 29.3332 16.0001 29.3332C23.3601 29.3332 29.3334 23.3598 29.3334 15.9998C29.3334 8.63984 23.3601 2.6665 16.0001 2.6665ZM22.6667 17.3332H17.3334V22.6665H14.6667V17.3332H9.33341V14.6665H14.6667V9.33317H17.3334V14.6665H22.6667V17.3332Z"
        fill={color}
      />
    </svg>
  )
}
