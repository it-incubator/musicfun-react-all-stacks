import { authKey } from "@/common/apiEntities"
import { authApi } from "./authApi.ts"
import { localStorageKeys } from "./authApi.types.ts"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useLoginMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      localStorage.setItem(localStorageKeys.refreshToken, data.data.refreshToken)
      localStorage.setItem(localStorageKeys.accessToken, data.data.accessToken)
      await qc.invalidateQueries({ queryKey: [authKey] })

      await qc.invalidateQueries()
    },
  })
}
