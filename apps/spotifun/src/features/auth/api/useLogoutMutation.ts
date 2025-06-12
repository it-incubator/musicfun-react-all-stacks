import { authKey } from "@/common/apiEntities"
import { authApi, localStorageKeys } from "@it-incubator/spotifun-api-sdk"
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
