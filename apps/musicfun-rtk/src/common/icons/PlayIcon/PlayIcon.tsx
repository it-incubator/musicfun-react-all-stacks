type Props = {
  color?: string
  size?: number
}

export const PlayIcon = ({ color = '#007bff', size = 40 }: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      fillRule="evenodd"
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m-1.306-6.154 4.72-2.787c.781-.462.781-1.656 0-2.118l-4.72-2.787C9.934 7.706 9 8.29 9 9.214v5.573c0 .923.934 1.507 1.694 1.059"
      clipRule="evenodd"
    ></path>
  </svg>
)
