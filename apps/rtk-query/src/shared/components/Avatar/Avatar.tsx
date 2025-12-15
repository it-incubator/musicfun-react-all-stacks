import { clsx } from 'clsx'

import type { FullName } from '@/features/profile'
import { getUserInitials } from '@/shared/utils'

import s from './Avatar.module.css'

type DefaultAvatarProps = {
  src?: string | null
  fullName?: FullName
  userLogin?: string
  className?: string
}

export const Avatar = ({ src, fullName, userLogin, className }: DefaultAvatarProps) => {
  const classNames = clsx(s.avatar, className)

  const initials = getUserInitials(fullName, userLogin)

  return (
    <div className={classNames}>
      {src ? <img src={src} alt="User avatar" /> : <span className={s.initials}>{initials}</span>}
    </div>
  )
}
