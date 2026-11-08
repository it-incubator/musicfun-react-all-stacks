import { Route, Routes } from "react-router"

import { PageNotFound, ProtectedRoute } from "@/common/components"
import { Path } from "@/common/routing"
import { useAuth } from "@/features/auth/lib/useAuth.ts"
import { Login } from "@/features/auth/ui/Login/Login.tsx"
import { OAuthCallback } from "@/features/auth/ui/OAuthCallback/OAuthCallback.tsx"
import { BoardPage } from "@/pages/BoardPage/BoardPage.tsx"
import { TaskRoute } from "@/pages/BoardPage/TaskRoute.tsx"
import { ExplorePage } from "@/pages/ExplorePage/ExplorePage.tsx"
import { MyBoardsPage } from "@/pages/MyBoardsPage/MyBoardsPage.tsx"

export const Routing = () => {
  const { isAuthed } = useAuth()

  return (
    <Routes>
      <Route path={Path.Main} element={<ExplorePage />} />
      <Route path={Path.Board} element={<BoardPage />}>
        <Route path="tasks/:taskId" element={<TaskRoute />} />
      </Route>
      <Route element={<ProtectedRoute isAllowed={isAuthed} redirectPath={`${Path.Login}?redirect=${Path.MyBoards}`} />}>
        <Route path={Path.MyBoards} element={<MyBoardsPage />} />
      </Route>
      <Route element={<ProtectedRoute isAllowed={!isAuthed} redirectPath={Path.MyBoards} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>
      <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
