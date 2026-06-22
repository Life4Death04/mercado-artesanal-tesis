import { z } from 'zod'

export const pedidoSchema = z.object({
  id: z.string(),
  total: z.number().nonnegative(),
  estado: z.enum(['pendiente', 'confirmado', 'entregado', 'cancelado']),
})

export type Pedido = z.infer<typeof pedidoSchema>
