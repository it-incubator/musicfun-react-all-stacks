import { Main } from "@/app/Main.tsx"
import { BoardsPage } from "@/features/boards/ui/BoardsPage/BoardsPage.tsx"
import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
  Boards: "/boards",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
    <Route path={Path.Boards} element={<BoardsPage />} />
  </Routes>
)
