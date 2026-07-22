import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { listProductos } from '../productos.api'

export const PRODUCTOS_LIST_QUERY_KEY = ['producer', 'products', 'list'] as const

/**
 * Reads the authenticated producer's product list.
 *
 * - Enabled only when the Auth0 session is authenticated and not loading.
 * - Token acquisition is delegated to useAuthenticatedApi() — this hook
 *   never calls the Auth0 token API directly (spec R2).
 * - Edge-parses moderationStatus on each product (spec R6).
 * - On 401 / 5xx, query enters `isError` state; the page surfaces it via
 *   `resolveErrorMessage(error)`. No silent retry on 401.
 */
export function useProductosQuery() {
  const { isAuthenticated, isLoading } = useAuth0()
  const apiRequest = useAuthenticatedApi()

  return useQuery({
    queryKey: PRODUCTOS_LIST_QUERY_KEY,
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: () => listProductos(apiRequest),
  })
}
