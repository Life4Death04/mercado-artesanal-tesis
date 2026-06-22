import { z } from 'zod'

export const productoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(2),
  productor: z.string().min(2),
  precio: z.number().positive(),
  categoria: z.string(),
  imagen: z.string().url().optional(),
})

export type Producto = z.infer<typeof productoSchema>
