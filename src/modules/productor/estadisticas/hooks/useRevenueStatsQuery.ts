import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { getRevenueStats } from '../estadisticas.api'
import type { StatsWindow } from '../estadisticas.schema'

/**
 * Cache key factory for revenue stats.
 * Namespaced per spec R4: ['producer', 'stats', 'revenue', window].
 */
export function revenueStatsQueryKey(window: StatsWindow) {
  return ['producer', 'stats', 'revenue', window] as const
}

/**
 * Reads revenue stats for the authenticated producer over the given window.
 *
 * - Enabled only when authenticated and Auth0 is not loading.
 * - Token via useAuthenticatedApi() — never reads token from module scope (spec R2).
 * - totalRevenue is a Decimal string; display via formatMoney (money-typing R2-R4).
 * - On 401 / 5xx: query enters isError; caller resolves via resolveErrorMessage.
 */
export function useRevenueStatsQuery(window: StatsWindow) {
  const { isAuthenticated, isLoading } = useAuth0()
  const apiCaller = useAuthenticatedApi()

  return useQuery({
    queryKey: revenueStatsQueryKey(window),
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 min — stats are not real-time
    queryFn: () => getRevenueStats(apiCaller, window),
  })
}
