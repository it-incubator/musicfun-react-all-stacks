import clsx from 'clsx'

import s from './PageWithHeader.module.css'

type PageWrapperProps = {
  children: React.ReactNode
  className?: string
}

export const PageWithHeader = ({ children, className }: PageWrapperProps) => {
  return <div className={clsx(s.wrapper, className)}>{children}</div>
}
