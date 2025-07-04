import { Path } from "@/common/routing"
import { Navigate, Outlet } from "react-router"

type Props = {
  isAllowed: boolean
  redirectPath?: string
}

export const ProtectedRoute = ({ isAllowed, redirectPath = Path.Main }: Props) => {
  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />
}
