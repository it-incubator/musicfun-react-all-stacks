import { useTranslation } from 'react-i18next'
import { ProfileDropdownMenu } from '@/features/auth'
import { useMeQuery } from '@/features/auth/api'
import { setIsAuthModalOpen } from '@/features/auth/model'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { useAppDispatch } from '@/shared/hooks'

import s from './Header.module.css'
import { LanguageIcon } from '@/shared/icons/LanguageIcon.tsx'
import { setLocale } from '@/shared/utils'

export const Header = () => {
  const { t } = useTranslation()

  const { data: user, isLoading } = useMeQuery()
  const dispatch = useAppDispatch()
  const isAuth = !!user

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
            avatar={'//unsplash.it/100/100'}
            name={user.login}
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
