type Props = {
  color?: string
  size?: number
}

export const UploadIcon = ({ size = 32, color = "currentColor" }: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.9999 20.0002V24.0002H7.99992V20.0002H5.33325V24.0002C5.33325 25.4668 6.53325 26.6668 7.99992 26.6668H23.9999C25.4666 26.6668 26.6666 25.4668 26.6666 24.0002V20.0002H23.9999ZM9.33325 12.0002L11.2133 13.8802L14.6666 10.4402V21.3335H17.3333V10.4402L20.7866 13.8802L22.6666 12.0002L15.9999 5.3335L9.33325 12.0002Z"
        fill={color}
      />
    </svg>
  )
}
