import { LoginButtonAndModal, ProfileDropdownMenu } from '@/features/auth'
import { useMeQuery } from '@/features/auth/api/use-me.query.ts'

import { useTranslation } from 'react-i18next'

import s from './Header.module.css'

export const Header = () => {
  const { data } = useMeQuery()
  const { t } = useTranslation()

  return (
    <header className={s.header}>
      <div className={s.logo}>Musicfun</div>
      {data ? <ProfileDropdownMenu avatar={'//unsplash.it/100/100'} /> : <LoginButtonAndModal />}
    </header>
  )
}
