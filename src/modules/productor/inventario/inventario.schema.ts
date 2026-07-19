import { z } from 'zod'

// ---------------------------------------------------------------------------
// Inventory Item DTO — response shape for GET /producers/me/inventory
// [source: mercado-artesanal-backend/openspec/specs/product-catalog/spec.md]
//
// money-typing R1: no monetary fields here — stock is a plain integer.
// ---------------------------------------------------------------------------

export type InventoryItemDTO = {
  id: string
  producerId: string
  name: string
  /** Human-readable category name for display. */
  categoryName: string
  stock: number
  lowStockThreshold: number
  isActive: boolean
  /** Primary image URL; may be null if the product has no image yet. */
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// UpdateStock request DTO — PATCH /producers/me/products/:id (stock field only)
// [frontend-defined; mirrors backend UpdateProductSchema partial]
// ---------------------------------------------------------------------------

export type UpdateStockPayload = {
  stock: number
}

// ---------------------------------------------------------------------------
// Update stock form schema — input/output split for React Hook Form v7 + Zod
//
// stock uses z.coerce.number() so <input type="number" /> DOM string is coerced
// to a number at parse time. No resolver casts and no valueAsNumber needed.
// useForm<z.input<typeof updateStockFormSchema>, unknown, z.output<typeof updateStockFormSchema>>
// ---------------------------------------------------------------------------

export const updateStockFormSchema = z
  .object({
    /**
     * Stock quantity — coerced from DOM string input to integer.
     * Non-negative: 0 is valid (product can be listed as out-of-stock).
     */
    stock: z.coerce
      .number()
      .int('El stock debe ser un número entero.')
      .min(0, 'El stock no puede ser negativo.'),
  })
  .strict()

/** Input type — what RHF holds in field state (strings from DOM inputs). */
export type UpdateStockFormInput = z.input<typeof updateStockFormSchema>
/** Output type — what Zod returns after coercion (numbers resolved). */
export type UpdateStockFormValues = z.output<typeof updateStockFormSchema>
