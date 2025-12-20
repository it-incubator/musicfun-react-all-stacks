import { PageWrapper } from '../common'
import { UserInfo, UserTabs } from './ui'
import s from './UserPage.module.css'
import { PageHeader } from '@/pages/common/ui/PageHeader'

export const UserPage = () => {
  return (
    <PageWrapper className={s.userPage}>
      <PageHeader />
      <UserInfo />
      <UserTabs />
    </PageWrapper>
  )
}
