import { z } from 'zod'

const cartProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  stock: z.number().int().nonnegative(),
  isAvailable: z.boolean().optional(),
  images: z.array(z.object({ id: z.string(), position: z.number().int().nonnegative(), url: z.string().url() })),
  producer: z.object({ id: z.string(), name: z.string().optional(), businessName: z.string().optional(), province: z.string().optional() }).optional(),
}).passthrough()

export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPriceSnapshot: z.string(),
  isAvailable: z.boolean().optional(),
  product: cartProductSchema,
}).passthrough()

export const cartSchema = z.object({
  id: z.string().optional(),
  items: z.array(cartItemSchema),
}).passthrough()

export type Cart = z.infer<typeof cartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
