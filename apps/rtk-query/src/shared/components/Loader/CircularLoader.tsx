import CircularProgress from '@mui/material/CircularProgress'
import s from './CircularLoader.module.css'

type Props = {
  size?: string | number
  color?: 'primary' | 'secondary' | 'inherit'
  className?: string
}

export const CircularLoader = ({ size, color, className }: Props) => {
  return (
    <div className={s.container}>
      <CircularProgress
        size={size}
        color={color === 'secondary' ? 'secondary' : color}
        sx={color === 'secondary' ? { color: '#FF38B6' } : undefined}
      />
    </div>
  )
}
