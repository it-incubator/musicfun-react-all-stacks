import { useAppSelector } from './useAppSelector'

export const useIsGlobalLoading = () => {
  return useAppSelector((state) => {
    const queries = state.baseApi.queries
    const mutations = state.baseApi.mutations

    // Filter requests, excluding requests to download tracks but for some reason it doesn't work
    // const nonTrackQueries = Object.entries(queries).filter(
    //   ([key]) => !key.includes('fetchTracksInfinite')
    // )

    const isLoadingQueries = Object.values(queries).some((q) => q?.status === 'pending')
    const isLoadingMutations = Object.values(mutations).some((m) => m?.status === 'pending')

    return isLoadingQueries || isLoadingMutations
  })
}
