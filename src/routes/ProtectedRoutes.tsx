import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthErrorState } from '../modules/auth/componentes/AuthErrorState'
import { AuthLoadingState } from '../modules/auth/componentes/AuthLoadingState'
import { homePathForRole } from '../modules/auth/authNavigation'
import type { BackendRole } from '../modules/auth/auth.types'
import { useCurrentUser } from '../modules/auth/hooks/useCurrentUser'

type ProtectedRoutesProps = {
  allowedRoles?: BackendRole[]
  requirePendingRole?: boolean
}

export function ProtectedRoutes({
  allowedRoles,
  requirePendingRole = false,
}: ProtectedRoutesProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth0()
  const currentUserQuery = useCurrentUser()

  if (isLoading) {
    return <AuthLoadingState />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />
  }

  if (currentUserQuery.isLoading) {
    return <AuthLoadingState message="Sincronizando tu cuenta..." />
  }

  if (currentUserQuery.isError || !currentUserQuery.data) {
    return <AuthErrorState error={currentUserQuery.error} />
  }

  const currentUser = currentUserQuery.data

  if (requirePendingRole && currentUser.role !== 'PENDING_ROLE') {
    return <Navigate to={homePathForRole(currentUser.role)} replace />
  }

  if (!requirePendingRole && currentUser.role === 'PENDING_ROLE') {
    return <Navigate to="/registro" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={homePathForRole(currentUser.role)} replace />
  }

  return <Outlet />
}
