import type { ReactNode } from 'react'
import s from './Layout.module.css'
import { NavBar } from '@/common/components'

type Props = {
  children: ReactNode
}

export const Layout = ({ children }: Props) => {
  return (
    <div className={s.layout}>
      <NavBar />
      <div className={s.layoutContent}>{children}</div>
    </div>
  )
}
