import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/features/auth/api/authApi.ts"
import { authKey } from "@/common/apiEntities"
import { localStorageKeys } from "@/features/auth/api/authApi.types.ts"

export const useMe = () => {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: [authKey],
    queryFn: authApi.getMe,
  })

  /** хелпер — вручную заставить /me обновиться */
  const invalidate = () => qc.invalidateQueries({ queryKey: [authKey] })

  return { query: query, invalidate }
}

export const useLogoutMutation = () => {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: () =>
      authApi.logout({
        refreshToken: localStorage.getItem(localStorageKeys.refreshToken)!,
      }),
    onSuccess: async () => {
      localStorage.removeItem(localStorageKeys.accessToken)
      localStorage.removeItem(localStorageKeys.refreshToken)
      await qc.invalidateQueries({ queryKey: [authKey] })
    },
  })

  return mutation
}
