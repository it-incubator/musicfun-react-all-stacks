import { useAppSelector } from '@/common/hooks'

export const useIsLoading = () => {
  return useAppSelector((state) => {
    const queries = state.baseApi.queries
    const mutations = state.baseApi.mutations

    const isLoadingQueries = Object.values(queries).some((q) => q?.status === 'pending')
    const isLoadingMutations = Object.values(mutations).some((m) => m?.status === 'pending')

    return isLoadingQueries || isLoadingMutations
  })
}
