import { adminIncidentsPageSchema } from './metricas.schema'
import type { AdminIncidentSummary } from './metricas.schema'

type ApiCaller = <TResponse>(
  path: string,
  options?: { method?: string; body?: unknown; signal?: AbortSignal },
) => Promise<TResponse>

const INCIDENTS_PAGE_SIZE = 100
const INCIDENTS_MAX_PAGES = 100

export async function getAllAdminIncidents(
  api: ApiCaller,
  signal?: AbortSignal,
): Promise<AdminIncidentSummary[]> {
  const byId = new Map<string, AdminIncidentSummary>()

  for (let page = 1; page <= INCIDENTS_MAX_PAGES; page += 1) {
    const response = adminIncidentsPageSchema.parse(
      await api<unknown>(`/admin/incidents?page=${page}&limit=${INCIDENTS_PAGE_SIZE}`, { signal }),
    )
    const previousSize = byId.size
    response.items.forEach((incident) => byId.set(incident.id, incident))

    if (page >= response.totalPages || response.items.length < INCIDENTS_PAGE_SIZE) break
    if (byId.size === previousSize) throw new Error('La paginación de incidencias devolvió una página repetida.')

    if (page === INCIDENTS_MAX_PAGES && response.totalPages > INCIDENTS_MAX_PAGES) {
      throw new Error('La lista de incidencias superó el límite seguro de paginación.')
    }
  }

  return [...byId.values()]
}
