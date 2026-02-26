import { useEffect } from 'react'

import { useMeQuery } from '@/features/auth/api/use-me.query'

import { useProfileStore } from '../profile-store'

export const useHydrateProfile = () => {
  const { data: me, isLoading } = useMeQuery()
  const hydrateProfileFromStorage = useProfileStore((state) => state.hydrateProfileFromStorage)
  const resetProfile = useProfileStore((state) => state.resetProfile)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!me?.userId) {
      resetProfile()
      return
    }

    hydrateProfileFromStorage(me.userId)
  }, [hydrateProfileFromStorage, isLoading, me?.userId, resetProfile])
}
