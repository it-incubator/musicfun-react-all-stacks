import { LoginButtonAndModal, ProfileDropdownMenu } from '@/features/auth'
import { useMeQuery } from '@/features/auth/api/use-me.query.ts'

import s from './Header.module.css'

export const Header = () => {
  const { data } = useMeQuery()

  return (
    <header className={s.header}>
      <div className={s.logo}>Musicfun</div>
      {data ? <ProfileDropdownMenu avatar={'//unsplash.it/100/100'} /> : <LoginButtonAndModal />}
    </header>
  )
}
