import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet } from 'react-router-dom'
import { homePathForRole } from '../modules/auth/authNavigation'
import { AuthLoadingState } from '../modules/auth/componentes/AuthLoadingState'
import { useCurrentUser } from '../modules/auth/hooks/useCurrentUser'

export function PublicRoutes() {
  const { isAuthenticated, isLoading } = useAuth0()
  const currentUserQuery = useCurrentUser()

  if (isLoading) {
    return <AuthLoadingState />
  }

  if (isAuthenticated && currentUserQuery.isLoading) {
    return <AuthLoadingState message="Sincronizando tu cuenta..." />
  }

  if (isAuthenticated && currentUserQuery.data) {
    return <Navigate to={homePathForRole(currentUserQuery.data.role)} replace />
  }

  return <Outlet />
}
