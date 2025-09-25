import { useTranslation } from 'react-i18next'

import { ProfileDropdownMenu } from '@/features/auth'
import { useMeQuery } from '@/features/auth/api'
import { setIsAuthModalOpen } from '@/features/auth/model'
import { Button } from '@/shared/components'
import { useAppDispatch } from '@/shared/hooks'

import s from './Header.module.css'

export const Header = () => {
  const { t } = useTranslation()

  const { data: user, isLoading } = useMeQuery()
  const dispatch = useAppDispatch()
  const isAuth = !!user

  return (
    <header className={s.header}>
      <div className={s.logo}>Musicfun</div>

      {isAuth ? (
        <ProfileDropdownMenu avatar={'//unsplash.it/100/100'} name={user.login} id={user.userId} />
      ) : isLoading ? null : (
        <Button onClick={() => dispatch(setIsAuthModalOpen({ isAuthModalOpen: true }))}>
          {t('auth.button.sign_in')}
        </Button>
      )}
    </header>
  )
}
