import { Loader } from '@/shared/components'
import { useIsGlobalLoading } from '@/shared/hooks'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store/store'

export const AppLoader = () => {
  const isLoading = useIsGlobalLoading()
  const isAdditionalLoading = useSelector((state: RootState) => state.additionalLoading)
  if (!isLoading || isAdditionalLoading) return null
  return <Loader />
}
