import clsx from 'clsx'

import s from './PageWrapper.module.css'

type PageWrapperProps = {
  children: React.ReactNode
  className?: string
}

export const PageWrapper = ({ children, className }: PageWrapperProps) => {
  return (
    <div style={{ border: '2px solid green' }} className={clsx(s.wrapper, className)}>
      {children}
    </div>
  )
}
