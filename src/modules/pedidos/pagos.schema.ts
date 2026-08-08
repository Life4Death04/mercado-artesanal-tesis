import { z } from 'zod'

export const deliveryModeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['shipping', 'pickup']),
  price: z.string(),
}).strict()

export const deliveryModeGroupSchema = z.object({
  producerId: z.string().min(1),
  modes: z.array(deliveryModeSchema),
}).strict()

export const deliveryModeGroupsSchema = z.array(deliveryModeGroupSchema)

export type DeliveryMode = z.infer<typeof deliveryModeSchema>
export type DeliveryModeGroup = z.infer<typeof deliveryModeGroupSchema>

export type DeliverySelection = {
  producerId: string
  deliveryModeId: string
}

export const createPaymentIntentInputSchema = z.object({
  deliverySelections: z.array(z.object({
    producerId: z.string().min(1),
    deliveryModeId: z.string().min(1),
  }).strict()).min(1),
  addressId: z.string().min(1).optional(),
}).strict()

export const paymentIntentResponseSchema = z.object({
  clientSecret: z.string().min(1),
}).strict()

export const paymentStatusSchema = z.discriminatedUnion('state', [
  z.object({
    state: z.literal('PROCESSING'),
    orderId: z.null(),
    code: z.literal('PAYMENT_PROCESSING'),
  }).strict(),
  z.object({
    state: z.literal('SUCCEEDED'),
    orderId: z.string().min(1),
    code: z.literal('PAYMENT_SUCCEEDED'),
  }).strict(),
  z.object({
    state: z.literal('FAILED'),
    orderId: z.null(),
    code: z.literal('PAYMENT_FAILED'),
  }).strict(),
  z.object({
    state: z.literal('PENDING'),
    orderId: z.null(),
    code: z.literal('PAYMENT_NEEDS_REVIEW'),
  }).strict(),
  z.object({
    state: z.literal('CANCELED'),
    orderId: z.null(),
    code: z.literal('PAYMENT_CANCELED'),
  }).strict(),
])

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentInputSchema>
export type PaymentStatus = z.infer<typeof paymentStatusSchema>
