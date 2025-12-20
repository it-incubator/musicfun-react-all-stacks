import { HeaderActions } from '@/pages/common/ui/HeaderActions'
import s from './PageHeader.module.css'

export const PageHeader = () => {
  return (
    <header className={s.header}>
      <HeaderActions />
    </header>
  )
}
