import {
  adminIncidentDetailSchema,
  adminIncidentsPageSchema,
  consumerIncidentDetailSchema,
  consumerIncidentsSchema,
  createIncidentInputSchema,
  resolveIncidentInputSchema,
  type AdminIncidentDetail,
  type AdminIncidentsPage,
  type ConsumerIncidentDetail,
  type ConsumerIncidentSummary,
  type CreateIncidentInput,
  type ResolveIncidentInput,
} from './incidencias.schema'

type ApiCaller = <TResponse>(
  path: string,
  options?: { method?: string; body?: unknown; signal?: AbortSignal },
) => Promise<TResponse>

export const incidenciasEndpoints = {
  consumerList: '/incidencias',
  consumerDetail: (incidentId: string) => `/incidencias/${encodeURIComponent(incidentId)}`,
  adminList: (page: number, limit: number) => `/admin/incidents?page=${page}&limit=${limit}`,
  adminDetail: (incidentId: string) => `/admin/incidents/${encodeURIComponent(incidentId)}`,
  adminResolve: (incidentId: string) => `/admin/incidents/${encodeURIComponent(incidentId)}/resolve`,
} as const

export async function getConsumerIncidents(api: ApiCaller, signal?: AbortSignal): Promise<ConsumerIncidentSummary[]> {
  return consumerIncidentsSchema.parse(await api<unknown>(incidenciasEndpoints.consumerList, { signal }))
}

export async function getConsumerIncident(api: ApiCaller, incidentId: string, signal?: AbortSignal): Promise<ConsumerIncidentDetail> {
  return consumerIncidentDetailSchema.parse(await api<unknown>(incidenciasEndpoints.consumerDetail(incidentId), { signal }))
}

export async function createConsumerIncident(api: ApiCaller, input: CreateIncidentInput): Promise<ConsumerIncidentDetail> {
  const body = createIncidentInputSchema.parse(input)
  return consumerIncidentDetailSchema.parse(await api<unknown>(incidenciasEndpoints.consumerList, { method: 'POST', body }))
}

export async function getAdminIncidents(api: ApiCaller, page: number, limit: number, signal?: AbortSignal): Promise<AdminIncidentsPage> {
  return adminIncidentsPageSchema.parse(await api<unknown>(incidenciasEndpoints.adminList(page, limit), { signal }))
}

export async function getAdminIncident(api: ApiCaller, incidentId: string, signal?: AbortSignal): Promise<AdminIncidentDetail> {
  return adminIncidentDetailSchema.parse(await api<unknown>(incidenciasEndpoints.adminDetail(incidentId), { signal }))
}

export async function resolveAdminIncident(api: ApiCaller, incidentId: string, input: ResolveIncidentInput): Promise<AdminIncidentDetail> {
  const body = resolveIncidentInputSchema.parse(input)
  return adminIncidentDetailSchema.parse(await api<unknown>(incidenciasEndpoints.adminResolve(incidentId), { method: 'PATCH', body }))
}
