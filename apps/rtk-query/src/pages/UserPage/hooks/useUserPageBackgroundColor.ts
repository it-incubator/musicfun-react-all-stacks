import { useMemo } from 'react'

import { selectProfileAvatar } from '@/features/profile'
import { usePageBackgroundColor } from '@/pages/common/hooks'
import { useOwnerData } from '@/pages/UserPage/hooks/useOwnerData.ts'
import { useAppSelector } from '@/shared/hooks'
import { decodeFileFromBase64 } from '@/shared/utils'

export const useUserPageBackgroundColor = () => {
  const { isProfileOwner, isMeQuerySuccess } = useOwnerData()
  const profileAvatarUrl = useAppSelector(selectProfileAvatar)

  const decodedProfileAvatarUrl = useMemo(
    () => decodeFileFromBase64(profileAvatarUrl),
    [profileAvatarUrl]
  )
  const imageUrlForBackgroundColor = isProfileOwner ? decodedProfileAvatarUrl : null
  const isLocalUrlData = !!decodedProfileAvatarUrl
  return usePageBackgroundColor(imageUrlForBackgroundColor, isMeQuerySuccess, isLocalUrlData)
}
