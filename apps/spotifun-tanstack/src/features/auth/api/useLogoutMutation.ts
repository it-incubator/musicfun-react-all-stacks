import { authKey } from "@/common/apiEntities"
import { authApi } from "./authApi.ts"
import { localStorageKeys } from "./authApi.types.ts"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useLogoutMutation = () => {
  const qc = useQueryClient()
  return useMutation({
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
}
