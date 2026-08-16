import { useQuery } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import { getAllAdminIncidents } from '../metricas.api'

export const ADMIN_METRICS_INCIDENTS_QUERY_KEY = ['admin', 'incidents', 'all', 'metrics'] as const

export function useAdminMetricsIncidentsQuery() {
  const api = useAuthenticatedApi()

  return useQuery({
    queryKey: ADMIN_METRICS_INCIDENTS_QUERY_KEY,
    queryFn: ({ signal }) => getAllAdminIncidents(api, signal),
    retry: false,
    refetchOnWindowFocus: false,
  })
}
