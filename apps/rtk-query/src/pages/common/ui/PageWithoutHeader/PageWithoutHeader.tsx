import clsx from 'clsx'

import s from './PageWithoutHeader.module.css'

type PageWrapperProps = {
  children: React.ReactNode
  className?: string
  backgroundColor?: string
}

export const PageWithoutHeader = ({ children, className, backgroundColor }: PageWrapperProps) => {
  const style = backgroundColor
    ? { background: `linear-gradient(180deg, ${backgroundColor} 0, #141414 300px, #141414 100%)` }
    : {}

  return (
    <div className={clsx(s.wrapper, className)} style={style}>
      {children}
    </div>
  )
}
