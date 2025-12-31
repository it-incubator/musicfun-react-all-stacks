import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { useMeQuery } from '@/features/auth/api'
import { setIsAuthModalOpen } from '@/features/auth/model'
import { selectProfileAvatar, selectProfileFullName } from '@/features/profile'
import { AccountMenu } from '@/layout/Header/AccountMenu'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Skeleton,
} from '@/shared/components'
import { Paths } from '@/shared/configs'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { LanguageIcon } from '@/shared/icons/LanguageIcon.tsx'
import { setLocale } from '@/shared/utils'

import s from './Header.module.css'

export const Header = () => {
  const { t } = useTranslation()

  const { data: user, isLoading } = useMeQuery()
  const dispatch = useAppDispatch()
  const isAuth = !!user
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)
  const profileFullName = useAppSelector(selectProfileFullName)

  const location = useLocation()
  const hasColorBg = ([Paths.Playlists, Paths.Tracks, Paths.Main] as string[]).includes(
    location.pathname
  )

  const renderActions = () => {
    if (isLoading) {
      return <Skeleton className={s.actionsSkeleton} />
    }

    if (isAuth) {
      return (
        <AccountMenu
          avatar={profileAvatarUrl}
          fullName={profileFullName}
          userLogin={user.login}
          id={user.userId}
        />
      )
    }

    return (
      <Button onClick={() => dispatch(setIsAuthModalOpen({ isAuthModalOpen: true }))}>
        {t('auth.button.sign_in')}
      </Button>
    )
  }

  return (
    <header
      className={s.header}
      style={{ backgroundColor: hasColorBg ? 'var(--color-bg-primary)' : '' }}>
      <div className={s.logo}>Musicfun</div>
      <div className={s.actions}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <LanguageIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLocale('en')}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocale('ru')}>Русский</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {renderActions()}
      </div>
    </header>
  )
}
