import { PageWrapper } from '../common'
import { UserInfo, UserTabs } from './ui'
import s from './UserPage.module.css'

export const UserPage = () => {
  return (
    <PageWrapper className={s.userPage}>
      <UserInfo />
      <UserTabs />
    </PageWrapper>
  )
}
