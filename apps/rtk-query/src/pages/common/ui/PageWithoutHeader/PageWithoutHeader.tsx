import clsx from 'clsx'

import s from './PageWithoutHeader.module.css'

type PageWrapperProps = {
  children: React.ReactNode
  className?: string
}

export const PageWithoutHeader = ({ children, className }: PageWrapperProps) => {
  return <div className={clsx(s.wrapper, className)}>{children}</div>
}
