import { authKey } from "@/common/apiEntities"
import { authApi } from "./authApi.ts"
import { useQuery } from "@tanstack/react-query"

export const useMe = () => {
  const query = useQuery({ queryKey: [authKey], queryFn: authApi.getMe })

  return query
}
