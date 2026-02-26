import { useMemo } from 'react'

import { selectProfileAvatar, useProfileStore } from '@/features/profile'
import { usePageBackgroundColor } from '@/shared/hooks'
import { decodeFileFromBase64 } from '@/shared/utils'

import { useUserPageData } from './useUserPageData'

export const useUserPageBackgroundColor = () => {
  const { isMeQuerySuccess, isProfileOwner } = useUserPageData()
  const profileAvatarUrl = useProfileStore(selectProfileAvatar)

  const decodedProfileAvatarUrl = useMemo(
    () => decodeFileFromBase64(profileAvatarUrl),
    [profileAvatarUrl]
  )
  const imageUrlForBackgroundColor = isProfileOwner ? decodedProfileAvatarUrl : null
  const isLocalUrlData = !!decodedProfileAvatarUrl

  return usePageBackgroundColor(imageUrlForBackgroundColor, isMeQuerySuccess, isLocalUrlData)
}
