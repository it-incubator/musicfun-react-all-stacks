import { clsx } from 'clsx'

import type { FullName } from '@/features/profile'

import s from './Avatar.module.css'

type DefaultAvatarProps = {
  src?: string | null
  fullName?: FullName
  login?: string
  className?: string
}

export const Avatar = ({ src, fullName, login, className }: DefaultAvatarProps) => {
  const classNames = clsx(s.avatar, className)

  const initials = fullName?.name
    ? `${fullName.name[0]} ${fullName.surname[0]}`
    : (login?.[0] ?? '?')

  return (
    <div className={classNames}>
      {src ? <img src={src} alt="User avatar" /> : <span className={s.initials}>{initials}</span>}
    </div>
  )
}
