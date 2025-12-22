import clsx from 'clsx'

import s from './PageWithoutHeader.module.css'

type PageWithoutHeaderProps = {
  children: React.ReactNode
  className?: string
}

export const PageWithoutHeader = ({ children, className }: PageWithoutHeaderProps) => {
  return <div className={clsx(s.wrapper, className)}>{children}</div>
}
