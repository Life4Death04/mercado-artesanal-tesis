export const consumerIncidentKeys = {
  all: ['consumer', 'incidents'] as const,
  list: () => ['consumer', 'incidents', 'list'] as const,
  detail: (incidentId: string) => ['consumer', 'incidents', 'detail', incidentId] as const,
} as const

export const adminIncidentKeys = {
  all: ['admin', 'incidents'] as const,
  list: (page: number, limit: number) => ['admin', 'incidents', 'list', page, limit] as const,
  detail: (incidentId: string) => ['admin', 'incidents', 'detail', incidentId] as const,
} as const
