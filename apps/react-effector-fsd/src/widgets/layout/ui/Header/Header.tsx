import s from './Header.module.css'
import { LoginButtonAndModal, ProfileDropdownMenu } from '@/features/auth'
import { useUnit } from 'effector-react/effector-react.mjs'
import { $isAuthorized } from '@/features/auth/model/model.ts'

export const Header = () => {
  const isAuthorized = useUnit($isAuthorized)
  return (
    <header className={s.header}>
      <div className={s.logo}>Musicfun</div>
      {isAuthorized ? <ProfileDropdownMenu avatar={'//unsplash.it/100/100'} /> : <LoginButtonAndModal />}
    </header>
  )
}
