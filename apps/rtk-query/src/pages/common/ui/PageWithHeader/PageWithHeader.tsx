import clsx from 'clsx'

import s from './PageWithHeader.module.css'

type PageWithHeaderProps = {
  children: React.ReactNode
  className?: string
}

export const PageWithHeader = ({ children, className }: PageWithHeaderProps) => {
  return <div className={clsx(s.wrapper, className)}>{children}</div>
}
