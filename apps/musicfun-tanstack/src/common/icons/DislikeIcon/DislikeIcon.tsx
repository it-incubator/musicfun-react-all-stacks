type Props = {
  width?: number
  height?: number
  fillColor?: string
  type?: 'filled' | 'outline'
}

export const DislikeIcon = ({ width = 22, height = 21, fillColor = '#FF38B6', type = 'outline' }: Props) => {
  const fill = type === 'filled' ? fillColor : 'black'
  const stroke = type === 'filled' ? fillColor : 'white'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 22" fill="none">
      <path
        d="M17.2497 0.5C16.1297 0.5 15.033 0.791667 14.0647 1.305L11.9997 7.5H15.4997L11.9997 19.1667L13.1663 8.66667H9.66634L11.463 2.37833C10.2147 1.21167 8.51134 0.5 6.74967 0.5C3.15634 0.5 0.333008 3.32333 0.333008 6.91667C0.333008 11.735 5.18634 15.2933 11.9997 21.5C18.3813 15.7367 23.6663 11.8633 23.6663 6.91667C23.6663 3.32333 20.843 0.5 17.2497 0.5ZM9.94634 16.5183C5.52467 12.5633 2.66634 9.83333 2.66634 6.91667C2.66634 4.63 4.46301 2.83333 6.74967 2.83333C7.43801 2.83333 8.13801 3.00833 8.76801 3.32333L6.57467 11H10.5647L9.94634 16.5183ZM15.6513 15.1183L18.638 5.16667H15.243L15.9547 3.04333C16.3747 2.90333 16.818 2.83333 17.2497 2.83333C19.5363 2.83333 21.333 4.63 21.333 6.91667C21.333 9.495 18.9763 12.085 15.6513 15.1183Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={0.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
