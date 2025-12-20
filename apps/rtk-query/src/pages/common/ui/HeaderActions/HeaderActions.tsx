import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { setLocale } from '@/shared/utils'
import { LanguageIcon } from '@/shared/icons'
import { AccountMenu } from '@/layout/Header'
import s from './HeaderActions.module.css'
import { useTranslation } from 'react-i18next'
import { setIsAuthModalOpen, useMeQuery } from '@/features/auth'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { selectProfileAvatar, selectProfileFullName } from '@/features/profile'

export const HeaderActions = () => {
  const { t } = useTranslation()

  const { data: user, isLoading } = useMeQuery()
  const dispatch = useAppDispatch()
  const isAuth = !!user
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)
  const profileFullName = useAppSelector(selectProfileFullName)

  return (
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
        <AccountMenu
          avatar={profileAvatarUrl}
          fullName={profileFullName}
          userLogin={user.login}
          id={user.userId}
        />
      ) : isLoading ? null : (
        <Button onClick={() => dispatch(setIsAuthModalOpen({ isAuthModalOpen: true }))}>
          {t('auth.button.sign_in')}
        </Button>
      )}
    </div>
  )
}
