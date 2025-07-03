import { selectIsLoggedIn } from "@/app/app-slice"
import { Main } from "@/app/Main"
import { PageNotFound } from "@/common/components"
import { useAppSelector } from "@/common/hooks"
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
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route path={Path.Main} element={<Main />} />
      <Route path={Path.Login} element={<Login />} />
      <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}

// <Routes>
//   <Route element={<ProtectedRoute isAllowed={isLoggedIn} redirectPath={Path.Login} />}>
//     <Route path={Path.Main} element={<Main />} />
//   </Route>
//   <Route element={<ProtectedRoute isAllowed={!isLoggedIn} />}>
//     <Route path={Path.Login} element={<Login />} />
//   </Route>
//   <Route path={Path.NotFound} element={<PageNotFound />} />
// </Routes>
