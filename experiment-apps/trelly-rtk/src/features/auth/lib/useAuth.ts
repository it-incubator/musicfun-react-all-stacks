import { useMeQuery } from "../api/authApi.ts"

export const useAuth = () => {
  const { data: user, isLoading } = useMeQuery()
  return { user, isAuthed: !!user, isLoading }
}
