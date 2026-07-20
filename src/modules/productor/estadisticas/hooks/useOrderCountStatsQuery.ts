import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { getOrderCountStats } from '../estadisticas.api'
import type { StatsWindow } from '../estadisticas.schema'

/**
 * Cache key factory for order count stats.
 * Namespaced per spec R4: ['producer', 'stats', 'order-count', window].
 */
export function orderCountStatsQueryKey(window: StatsWindow) {
  return ['producer', 'stats', 'order-count', window] as const
}

/**
 * Reads the count of non-cancelled SubOrders for the authenticated producer
 * over the given stats window.
 *
 * - Enabled only when authenticated and Auth0 is not loading.
 * - Token via useAuthenticatedApi() (spec R2).
 * - count is an integer (not money) — safe to display directly as a number.
 * - On 401 / 5xx: query enters isError; caller resolves via resolveErrorMessage.
 */
export function useOrderCountStatsQuery(window: StatsWindow) {
  const { isAuthenticated, isLoading } = useAuth0()
  const apiCaller = useAuthenticatedApi()

  return useQuery({
    queryKey: orderCountStatsQueryKey(window),
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    queryFn: () => getOrderCountStats(apiCaller, window),
  })
}
