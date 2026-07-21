import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { listPedidos } from '../pedidos.api'
import type { SubOrderStatusFilter } from '../pedidos.schema'
import type { SubOrderStatus } from '../pedidos.schema'

/**
 * Base cache key for the producer sub-orders list.
 * Namespaced per spec R4: ['producer', 'sub-orders'].
 * Filter appended when a status filter is active.
 */
export const PEDIDOS_QUERY_KEY_BASE = ['producer', 'sub-orders'] as const

export function pedidosQueryKey(statusFilter?: SubOrderStatus) {
  if (statusFilter) {
    return [...PEDIDOS_QUERY_KEY_BASE, statusFilter] as const
  }

  return PEDIDOS_QUERY_KEY_BASE
}

/**
 * Reads the authenticated producer's SubOrders list.
 *
 * - Enabled only when the Auth0 session is authenticated and not loading.
 * - Token acquisition delegated to useAuthenticatedApi() — never calls Auth0 directly (spec R2).
 * - SubOrderStatus edge-parsed in pedidos.api.ts — unknown enum values throw ApiError (spec R6).
 * - On 401 / 5xx: query enters isError; caller resolves via resolveErrorMessage. No silent retry.
 * - Cache key: ['producer', 'sub-orders'] or ['producer', 'sub-orders', statusFilter].
 */
export function usePedidosQuery(statusFilter?: Exclude<SubOrderStatusFilter, 'all'>) {
  const { isAuthenticated, isLoading } = useAuth0()
  const apiCaller = useAuthenticatedApi()

  return useQuery({
    queryKey: pedidosQueryKey(statusFilter),
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: () => listPedidos(apiCaller, statusFilter ? { status: statusFilter } : undefined),
  })
}
