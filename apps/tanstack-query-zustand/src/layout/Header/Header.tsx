import { LoginButtonAndModal, ProfileDropdownMenu } from '@/features/auth'
import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { selectProfileAvatar, selectProfileFullName, useProfileStore } from '@/features/profile'
import { LanguageSwitcher, Skeleton } from '@/shared/components'
import { useLocation } from 'react-router'

import s from './Header.module.css'

export const Header = () => {
  const { data, isLoading } = useMeQuery()
  const { pathname } = useLocation()
  const hasColorBg = ['/', '/tracks', '/playlists'].includes(pathname)
  const profileAvatarUrl = useProfileStore(selectProfileAvatar)
  const profileFullName = useProfileStore(selectProfileFullName)

  return (
    <header
      className={s.header}
      style={{ backgroundColor: hasColorBg ? 'var(--color-bg-primary)' : '' }}>
      <div className={s.logo}>Musicfun</div>
      <div className={s.actions}>
        <LanguageSwitcher />
        {isLoading && <Skeleton className={s.actionsSkeleton} />}
        {!isLoading &&
          (data ? (
            <ProfileDropdownMenu
              avatar={profileAvatarUrl}
              fullName={profileFullName}
              userLogin={data.login}
              id={data.userId}
            />
          ) : (
            <LoginButtonAndModal />
          ))}
      </div>
    </header>
  )
}
