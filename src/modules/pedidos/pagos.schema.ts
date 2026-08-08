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

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentInputSchema>
