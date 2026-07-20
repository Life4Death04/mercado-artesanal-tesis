import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { getLowStockStats } from '../estadisticas.api'

/**
 * Cache key for low-stock stats.
 * Namespaced per spec R4: ['producer', 'stats', 'low-stock'].
 */
export const LOW_STOCK_STATS_QUERY_KEY = ['producer', 'stats', 'low-stock'] as const

/**
 * Reads the low-stock alert list for the authenticated producer.
 * Delegates to the inventory capability on the backend (per sales-stats spec).
 *
 * Products at or below their lowStockThreshold are included.
 *
 * - Enabled only when authenticated and Auth0 is not loading.
 * - Token via useAuthenticatedApi() (spec R2).
 * - On 401 / 5xx: query enters isError; caller resolves via resolveErrorMessage.
 */
export function useLowStockStatsQuery() {
  const { isAuthenticated, isLoading } = useAuth0()
  const apiCaller = useAuthenticatedApi()

  return useQuery({
    queryKey: LOW_STOCK_STATS_QUERY_KEY,
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 min — low-stock alerts are more time-sensitive
    queryFn: () => getLowStockStats(apiCaller),
  })
}
