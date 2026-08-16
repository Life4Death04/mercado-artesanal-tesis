import { z } from 'zod'

export const adminIncidentSummarySchema = z.object({
  id: z.string(),
  status: z.enum(['OPEN', 'RESOLVED']),
  createdAt: z.string(),
  resolvedAt: z.string().nullable(),
})

export const adminIncidentsPageSchema = z.object({
  items: z.array(adminIncidentSummarySchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type AdminIncidentSummary = z.infer<typeof adminIncidentSummarySchema>
