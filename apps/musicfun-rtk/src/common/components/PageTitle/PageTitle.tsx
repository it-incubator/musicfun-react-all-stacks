import type { ReactNode } from 'react'
import s from './PageTitle.module.css'

type Props = {
  children?: ReactNode
}

export const PageTitle = ({ children }: Props) => {
  return <h1 className={s.title}>{children}</h1>
}
