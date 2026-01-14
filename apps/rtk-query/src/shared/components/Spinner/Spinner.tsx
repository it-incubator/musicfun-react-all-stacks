import type { FC } from 'react'

import s from './spinner.module.css'

export type SpinnerProps = {
  fullScreen?: boolean
  size?: number
}

export const Spinner: FC<SpinnerProps> = ({ fullScreen = false, size = 48 }) => {
  const containerStyle = {
    height: fullScreen ? '100vh' : '100%',
  }

  const style = {
    height: size,
    width: size,
  }

  return (
    <div className={s.container} style={containerStyle}>
      <span className={s.loader} style={style} />
    </div>
  )
}
