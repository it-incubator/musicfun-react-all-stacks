import { LoginButtonAndModal, ProfileDropdownMenu } from '@/features/auth'
import { useMeQuery } from '@/features/auth/api'

import s from './Header.module.css'

export const Header = () => {
  const { data: me } = useMeQuery()

  const isAuth = !!me

  return (
    <header className={s.header}>
      <div className={s.logo}>Musicfun</div>

      {isAuth ? (
        <ProfileDropdownMenu avatar={'//unsplash.it/100/100'} name={'Martin Fowler'} id={'1'} />
      ) : (
        <LoginButtonAndModal />
      )}
    </header>
  )
}
