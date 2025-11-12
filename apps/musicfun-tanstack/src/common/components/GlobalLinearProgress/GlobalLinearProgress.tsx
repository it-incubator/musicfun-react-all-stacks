import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { LinearProgress } from '@/common/components'

export const GlobalLinearProgress = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  const isActive = isFetching > 0 || isMutating > 0

  return isActive ? <LinearProgress /> : null
}
