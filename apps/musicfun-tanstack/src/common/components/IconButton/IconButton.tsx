import type { ButtonHTMLAttributes } from 'react'
import s from './IconButton.module.css'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export const IconButton = ({ className = '', ...rest }: Props) => {
  return <button className={`${s.btnIcon} ${className}`} {...rest} />
}
