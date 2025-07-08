import { LoginButtonAndModal, ProfileDropdownMenu } from '@/features/auth'

import s from './Header.module.css'

const IS_AUTH = true // temporary data

export const Header = () => {
  return (
    <header className={s.header}>
      <div className={s.logo}>Musicfun</div>

      {IS_AUTH ? (
        <ProfileDropdownMenu avatar={'//unsplash.it/100/100'} name={'Martin Fowler'} id={'1'} />
      ) : (
        <LoginButtonAndModal />
      )}
    </header>
  )
}
