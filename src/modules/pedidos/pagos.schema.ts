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
