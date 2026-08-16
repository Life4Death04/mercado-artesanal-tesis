import { z } from 'zod'

const decimalSchema = z.string().regex(/^\d+\.\d{2}$/, 'amount must be a non-negative Decimal string with two decimal places')
const incidentIdSchema = z.string().min(1).max(256)
const incidentStatusSchema = z.enum(['OPEN', 'RESOLVED'])
const fulfillmentStatusSchema = z.enum(['pending', 'preparing', 'sent', 'delivered', 'cancelled'])
const deliveryModeTypeSchema = z.enum(['PERSONAL_DELIVERY', 'PICKUP', 'SHIPPING_FLAT_RATE'])

const incidentTargetSummarySchema = z.object({
  subOrderId: incidentIdSchema,
  producerBusinessName: z.string().min(1),
  subtotal: decimalSchema,
  fulfillmentStatus: fulfillmentStatusSchema,
}).strict()

const incidentSummaryBaseSchema = z.object({
  id: incidentIdSchema,
  status: incidentStatusSchema,
  reportReason: z.string(),
  createdAt: z.iso.datetime(),
  resolvedAt: z.iso.datetime().nullable(),
  target: incidentTargetSummarySchema,
}).strict()

const incidentLineSchema = z.object({
  productId: incidentIdSchema,
  quantity: z.number().int().positive(),
  unitPrice: decimalSchema,
}).strict()

const incidentTargetDetailSchema = incidentTargetSummarySchema.extend({
  shippingCost: decimalSchema,
  lines: z.array(incidentLineSchema).min(1),
  trackingNumber: z.string().nullable(),
  deliveryModeType: deliveryModeTypeSchema,
}).strict()

const incidentResolutionSchema = z.object({
  reason: z.string(),
  resolvedAt: z.iso.datetime(),
  resolvedById: incidentIdSchema,
}).strict()

export const consumerIncidentSummarySchema = incidentSummaryBaseSchema
export const consumerIncidentsSchema = z.array(consumerIncidentSummarySchema)

export const consumerIncidentDetailSchema = incidentSummaryBaseSchema.extend({
  updatedAt: z.iso.datetime(),
  resolution: incidentResolutionSchema.nullable(),
  target: incidentTargetDetailSchema,
}).strict()

export const adminIncidentSummarySchema = incidentSummaryBaseSchema.extend({
  reporterName: z.string().trim().min(1).nullable(),
}).strict()

export const adminIncidentsPageSchema = z.object({
  items: z.array(adminIncidentSummarySchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
}).strict()

export const adminIncidentDetailSchema = consumerIncidentDetailSchema.extend({
  reporter: z.object({
    name: z.string().trim().min(1).nullable(),
    email: z.email(),
  }).strict(),
}).strict()

export const createIncidentInputSchema = z.object({
  subOrderId: incidentIdSchema,
  reason: z.string().trim().min(1, 'Describe el problema.').max(2000, 'El motivo no puede superar los 2000 caracteres.'),
}).strict()

export const resolveIncidentInputSchema = z.object({
  reason: z.string().trim().min(1, 'Describe la resolución.').max(2000, 'La resolución no puede superar los 2000 caracteres.'),
}).strict()

export type ConsumerIncidentSummary = z.infer<typeof consumerIncidentSummarySchema>
export type ConsumerIncidentDetail = z.infer<typeof consumerIncidentDetailSchema>
export type AdminIncidentSummary = z.infer<typeof adminIncidentSummarySchema>
export type AdminIncidentDetail = z.infer<typeof adminIncidentDetailSchema>
export type AdminIncidentsPage = z.infer<typeof adminIncidentsPageSchema>
export type CreateIncidentInput = z.infer<typeof createIncidentInputSchema>
export type ResolveIncidentInput = z.infer<typeof resolveIncidentInputSchema>
export type IncidentLine = z.infer<typeof incidentLineSchema>
