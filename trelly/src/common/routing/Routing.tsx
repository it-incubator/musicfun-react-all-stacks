import { Main } from "@/app/Main.tsx"

import { Route, Routes } from "react-router"

export const Path = {
  Main: "/",
} as const

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<Main />} />
  </Routes>
)
