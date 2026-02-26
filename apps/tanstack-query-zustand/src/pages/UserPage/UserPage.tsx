import { PageWithoutHeader } from '../common'
import { useUserPageBackgroundColor } from './hooks'
import { UserInfo, UserTabs } from './ui'
import s from './UserPage.module.css'

export const UserPage = () => {
  const { dominantColor, canvasRef } = useUserPageBackgroundColor()

  return (
    <PageWithoutHeader
      className={s.userPage}
      backgroundColor={dominantColor || 'var(--color-bg-primary)'}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <UserInfo />
      <UserTabs />
    </PageWithoutHeader>
  )
}
