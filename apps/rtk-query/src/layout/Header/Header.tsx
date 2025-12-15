import { useTranslation } from 'react-i18next'

import { ProfileDropdownMenu } from '@/features/auth'
import { useMeQuery } from '@/features/auth/api'
import { setIsAuthModalOpen } from '@/features/auth/model'
import { selectProfileAvatar, selectProfileFullName } from '@/features/profile'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
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

  return (
    <header className={s.header}>
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
        {isAuth ? (
          <ProfileDropdownMenu
            avatar={profileAvatarUrl}
            fullName={profileFullName}
            login={user.login}
            id={user.userId}
          />
        ) : isLoading ? null : (
          <Button onClick={() => dispatch(setIsAuthModalOpen({ isAuthModalOpen: true }))}>
            {t('auth.button.sign_in')}
          </Button>
        )}
      </div>
    </header>
  )
}
