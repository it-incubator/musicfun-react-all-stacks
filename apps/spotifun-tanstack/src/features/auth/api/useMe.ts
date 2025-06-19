import { authKey } from "@/common/apiEntities"
import { authApi } from "./authApi.ts"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useMe = () => {
  const qc = useQueryClient()

  const query = useQuery({ queryKey: [authKey], queryFn: authApi.getMe })

  /** хелпер — вручную заставить /me обновиться */
  const invalidate = () => qc.invalidateQueries({ queryKey: [authKey] })

  return { query: query, invalidate }
}
