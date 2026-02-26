import { clsx } from 'clsx'

import { getUserInitials } from '@/shared/utils/get-user-initials'

import s from './Avatar.module.css'

type FullName = {
  name?: string
  surname?: string
}

type AvatarProps = {
  src?: string | null
  fullName?: FullName
  userLogin?: string
  className?: string
}

export const Avatar = ({ src, fullName, userLogin, className }: AvatarProps) => {
  const initials = getUserInitials(fullName, userLogin)

  return (
    <div className={clsx(s.avatar, className)}>
      {src ? <img src={src} alt="User avatar" /> : <span className={s.initials}>{initials}</span>}
    </div>
  )
}
