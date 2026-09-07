import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../auth/hooks/useAuthenticatedApi'
import {
  createConsumerIncident,
  getAdminIncident,
  getAdminIncidents,
  getConsumerIncident,
  getConsumerIncidents,
  resolveAdminIncident,
} from './incidencias.api'
import { adminIncidentKeys, consumerIncidentKeys } from './incidencias.queryKeys'
import type { CreateIncidentInput, ResolveIncidentInput } from './incidencias.schema'

export function useConsumerIncidentsQuery() {
  const { isAuthenticated, isLoading } = useAuth0()
  const api = useAuthenticatedApi()
  return useQuery({
    queryKey: consumerIncidentKeys.list(),
    queryFn: ({ signal }) => getConsumerIncidents(api, signal),
    enabled: isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useConsumerIncidentQuery(incidentId: string | null) {
  const { isAuthenticated, isLoading } = useAuth0()
  const api = useAuthenticatedApi()
  return useQuery({
    queryKey: consumerIncidentKeys.detail(incidentId ?? 'missing'),
    queryFn: ({ signal }) => getConsumerIncident(api, incidentId!, signal),
    enabled: incidentId !== null && isAuthenticated && !isLoading,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useCreateConsumerIncidentMutation() {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateIncidentInput) => createConsumerIncident(api, input),
    onSuccess: (incident) => {
      queryClient.setQueryData(consumerIncidentKeys.detail(incident.id), incident)
      return queryClient.invalidateQueries({ queryKey: consumerIncidentKeys.all })
    },
  })
}

export function useAdminIncidentsQuery(page: number, limit: number) {
  const api = useAuthenticatedApi()
  return useQuery({
    queryKey: adminIncidentKeys.list(page, limit),
    queryFn: ({ signal }) => getAdminIncidents(api, page, limit, signal),
    placeholderData: (previousData) => previousData,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useAdminIncidentQuery(incidentId: string | null) {
  const api = useAuthenticatedApi()
  return useQuery({
    queryKey: adminIncidentKeys.detail(incidentId ?? 'missing'),
    queryFn: ({ signal }) => getAdminIncident(api, incidentId!, signal),
    enabled: incidentId !== null,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useResolveAdminIncidentMutation(incidentId: string) {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ResolveIncidentInput) => resolveAdminIncident(api, incidentId, input),
    onSuccess: (incident) => {
      queryClient.setQueryData(adminIncidentKeys.detail(incident.id), incident)
      return queryClient.invalidateQueries({ queryKey: adminIncidentKeys.all })
    },
    onError: () => queryClient.invalidateQueries({ queryKey: adminIncidentKeys.all }),
  })
}
