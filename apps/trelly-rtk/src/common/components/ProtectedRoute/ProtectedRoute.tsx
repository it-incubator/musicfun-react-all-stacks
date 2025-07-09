import { Path } from "@/common/routing"
import type { ReactNode } from "react"
import { Navigate, Outlet } from "react-router"

type Props = {
  isAllowed: boolean
  children?: ReactNode
  redirectPath?: string
}

export const ProtectedRoute = ({ children, isAllowed, redirectPath = Path.Main }: Props) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} />
  }
  return children || <Outlet />
}
