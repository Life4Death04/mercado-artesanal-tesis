import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { listInventario } from '../inventario.api'

/**
 * Cache key for the producer inventory list.
 * Namespaced per spec R4: ['producer', 'inventory'].
 */
export const INVENTARIO_QUERY_KEY = ['producer', 'inventory'] as const

/**
 * Reads the authenticated producer's inventory (product list projected for stock management).
 *
 * - Enabled only when the Auth0 session is authenticated and not loading.
 * - Token acquisition is delegated to useAuthenticatedApi() — this hook
 *   never calls Auth0 token APIs directly (spec R2).
 * - On 401 / 5xx, query enters `isError` state; the page surfaces it via
 *   `resolveErrorMessage(error)`. No silent retry on 401.
 * - Cache key: ['producer', 'inventory'] (spec R4).
 */
export function useInventarioQuery() {
  const { isAuthenticated, isLoading } = useAuth0()
  const apiRequest = useAuthenticatedApi()

  return useQuery({
    queryKey: INVENTARIO_QUERY_KEY,
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: () => listInventario(apiRequest),
  })
}
