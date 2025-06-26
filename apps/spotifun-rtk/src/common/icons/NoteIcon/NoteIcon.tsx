type Props = {
  color?: string
  size?: number
}

export const NoteIcon = ({ size = 32, color = "currentColor" }: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 4L16.0133 18.0667C15.2267 17.6133 14.32 17.3333 13.3467 17.3333C10.3867 17.3333 8 19.72 8 22.6667C8 25.6133 10.3867 28 13.3467 28C16.3067 28 18.6667 25.6133 18.6667 22.6667V9.33333H24V4H16ZM13.3467 25.3333C11.88 25.3333 10.68 24.1333 10.68 22.6667C10.68 21.2 11.88 20 13.3467 20C14.8133 20 16.0133 21.2 16.0133 22.6667C16.0133 24.1333 14.8133 25.3333 13.3467 25.3333Z"
        fill={color}
      />
    </svg>
  )
}
