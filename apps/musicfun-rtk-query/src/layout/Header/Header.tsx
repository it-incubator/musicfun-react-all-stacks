import { ProfileDropdownMenu } from '@/features/auth'
import { useMeQuery } from '@/features/auth/api'
import { setIsAuthModalOpen } from '@/features/auth/model'
import { Button } from '@/shared/components'
import { useAppDispatch } from '@/shared/hooks'

import s from './Header.module.css'

export const Header = () => {
  const { data: user } = useMeQuery()
  const dispatch = useAppDispatch()
  const isAuth = !!user

  return (
    <header className={s.header}>
      <div className={s.logo}>Musicfun</div>

      {isAuth ? (
        <ProfileDropdownMenu avatar={'//unsplash.it/100/100'} name={user.login} id={user.userId} />
      ) : (
        <Button onClick={() => dispatch(setIsAuthModalOpen({ isAuthModalOpen: true }))}>
          Sign in
        </Button>
      )}
    </header>
  )
}
