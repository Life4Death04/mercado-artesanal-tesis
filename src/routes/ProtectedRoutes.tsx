import { Navigate, Outlet } from 'react-router-dom'

type ProtectedRoutesProps = {
  isAllowed?: boolean
}

export function ProtectedRoutes({ isAllowed = true }: ProtectedRoutesProps) {
  if (!isAllowed) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
