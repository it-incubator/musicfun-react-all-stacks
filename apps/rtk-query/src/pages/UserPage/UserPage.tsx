import { selectProfileAvatar } from '@/features/profile'
import { PageWithoutHeader } from '@/pages/common'
import { usePageBackgroundColor } from '@/pages/common/hooks'
import { useOwnerData } from '@/pages/UserPage/hooks'
import { useAppSelector } from '@/shared/hooks'

import { UserInfo, UserTabs } from './ui'
import s from './UserPage.module.css'

export const UserPage = () => {
  const { isProfileOwner, isMeQuerySuccess } = useOwnerData()
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)

  const imageUrlForBackgroundColor = isProfileOwner ? profileAvatarUrl : null

  const { dominantColor, canvasRef } = usePageBackgroundColor(
    imageUrlForBackgroundColor,
    isMeQuerySuccess
  )

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
