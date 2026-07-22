import { z } from 'zod'

export const productoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(2),
  productor: z.string().min(2),
  precio: z.string().regex(/^\d+(\.\d+)?$/, 'precio must be a Decimal string'),
  categoria: z.string(),
  imagen: z.string().url().optional(),
})

export type Producto = z.infer<typeof productoSchema>
