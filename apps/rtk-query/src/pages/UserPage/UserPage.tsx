import { PageWithoutHeader } from '@/pages/common'
import { useUserPageBackgroundColor } from '@/pages/UserPage/hooks'

import { UserInfo, UserTabs } from './ui'
import s from './UserPage.module.css'

export const UserPage = () => {
  const { dominantColor, canvasRef } = useUserPageBackgroundColor()

  return (
    <PageWithoutHeader className={s.userPage} backgroundColor={dominantColor}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {dominantColor && (
        <>
          <UserInfo />
          <UserTabs />
        </>
      )}
    </PageWithoutHeader>
  )
}
