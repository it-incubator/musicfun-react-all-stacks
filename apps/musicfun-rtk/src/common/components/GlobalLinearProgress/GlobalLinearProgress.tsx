import { LinearProgress } from '@/common/components'
import { useIsLoading } from './model/useIsLoading'

export const GlobalLinearProgress = () => {
  const isActive = useIsLoading()
  return isActive ? <LinearProgress /> : null
}
