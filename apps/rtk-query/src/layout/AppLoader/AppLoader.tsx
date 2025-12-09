import { Loader } from '@/shared/components'
import { useIsGlobalLoading } from '@/shared/hooks'

export const AppLoader = () => {
  const isLoading = useIsGlobalLoading()
  if (!isLoading) return null
  return <Loader />
}
