import { z } from 'zod'

export const pedidoSchema = z.object({
  id: z.string(),
  total: z.string().regex(/^\d+(\.\d+)?$/, 'total must be a Decimal string'),
  estado: z.enum(['pendiente', 'confirmado', 'entregado', 'cancelado']),
})

export type Pedido = z.infer<typeof pedidoSchema>
