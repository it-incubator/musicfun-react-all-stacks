import { Main } from "@/app/ui/Main.tsx"
import { PageNotFound, ProtectedRoute } from "@/common/components"
import { useMeQuery } from "@/features/auth/api/authApi.ts"
import { Login } from "@/features/auth/ui/Login/Login"
import { Route, Routes } from "react-router"
import { OAuthCallback } from "../../features/auth/ui/OAuthCallback/OAuthCallback.tsx"

export const Path = {
  Main: "/",
  Login: "/login",
  OAuthRedirect: "/oauth/callback",
  NotFound: "*",
} as const

export const Routing = () => {
  const { data } = useMeQuery()

  return (
    <Routes>
      <Route path={Path.Main} element={<Main />} />
      <Route element={<ProtectedRoute isAllowed={!data} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>
      <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
