import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { listEntregas } from '../entregas.api'

/**
 * Cache key for the producer delivery modes list.
 * Namespaced per spec R4: ['producer', 'delivery-modes'].
 */
export const ENTREGAS_QUERY_KEY = ['producer', 'delivery-modes'] as const

/**
 * Reads the authenticated producer's configured delivery modes.
 *
 * - Enabled only when the Auth0 session is authenticated and not loading.
 * - Token acquisition is delegated to useAuthenticatedApi() — this hook
 *   never calls Auth0 token APIs directly (spec R2).
 * - Edge-parses DeliveryModeType enum on each item (spec R6).
 * - On 401 / 5xx, query enters `isError` state; the page surfaces it via
 *   `resolveErrorMessage(error)`. No silent retry on 401.
 * - Cache key: ['producer', 'delivery-modes'] (spec R4).
 */
export function useEntregasQuery() {
  const { isAuthenticated, isLoading } = useAuth0()
  const apiRequest = useAuthenticatedApi()

  return useQuery({
    queryKey: ENTREGAS_QUERY_KEY,
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: () => listEntregas(apiRequest),
  })
}
