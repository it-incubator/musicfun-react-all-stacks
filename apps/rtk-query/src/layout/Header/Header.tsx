import s from './Header.module.css'
import { HeaderActions } from '@/pages/common/ui/HeaderActions'

type Props = {
  variant?: 'compact' | 'default'
}

export const Header = ({ variant = 'default' }: Props) => {
  return (
    <header className={s.header}>
      <div className={s.logo}>Musicfun</div>
      {variant === 'default' && <HeaderActions />}
    </header>
  )
}
