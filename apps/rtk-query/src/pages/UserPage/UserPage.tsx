import { PageWithoutHeader } from '@/pages/common'

import { UserInfo, UserTabs } from './ui'
import s from './UserPage.module.css'

export const UserPage = () => {
  return (
    <PageWithoutHeader className={s.userPage}>
      <UserInfo />
      <UserTabs />
    </PageWithoutHeader>
  )
}
