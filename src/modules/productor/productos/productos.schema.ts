import { z } from 'zod'

// ---------------------------------------------------------------------------
// Enums (control-flow fields — edge-parsed at hook boundary)
// [source: mercado-artesanal-backend/openspec/specs/product-catalog/spec.md]
// ---------------------------------------------------------------------------

/** ModerationStatus drives producer-side display (badge color, list filtering). */
export const ModerationStatusSchema = z.enum(['OK', 'REPORTED', 'REMOVED'])
export type ModerationStatus = z.infer<typeof ModerationStatusSchema>

// ---------------------------------------------------------------------------
// Category DTO — GET /api/v1/categories (public, no auth)
// [source: mercado-artesanal-backend/openspec/specs/product-taxonomy/spec.md]
// ---------------------------------------------------------------------------

export type CategoryDTO = {
  id: string
  slug: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// ProductImage DTOs — embedded in product responses
// [source: mercado-artesanal-backend/openspec/specs/product-images/spec.md]
//
// ProductImageDTO: full detail shape (used in upload confirm response, etc.)
// ProductImageListDTO: list-projection shape from GET /producers/me/products
//   — backend branch feature/expose-product-images-in-producer-list exposes
//     ordered images without s3Key (ready-to-use URL, no re-sign needed).
// ---------------------------------------------------------------------------

/** Full image DTO — includes s3Key (detail/confirm responses). */
export type ProductImageDTO = {
  id: string
  productId: string
  s3Key: string
  mimeType: string
  position: number
  createdAt: string
}

/**
 * Lightweight image projection embedded in the producer product LIST response.
 * Backend orders by position ASC, createdAt ASC at the DB level.
 * s3Key is NOT exposed here — url is a ready-to-use signed URL.
 * Primary thumbnail accessor: images?.[0]?.url
 */
export type ProductImageListDTO = {
  id: string
  position: number
  url: string
}

// ---------------------------------------------------------------------------
// Product DTO — response shape for GET/POST/PATCH on /producers/me/products
// [source: mercado-artesanal-backend/openspec/specs/product-catalog/spec.md]
// money-typing R1: price is always a string (Prisma Decimal serialized as string)
// ---------------------------------------------------------------------------

export type ProductDTO = {
  id: string
  producerId: string
  categoryId: string
  name: string
  description: string
  /** Decimal string from Prisma — display via formatMoney; NEVER parse for math. */
  price: string
  stock: number
  lowStockThreshold: number
  isActive: boolean
  ingredients: string | null
  allergens: string[]
  weight: number | null
  presentation: string | null
  reportedAt: string | null
  /** Edge-parsed at hook boundary to guard control-flow branches. */
  moderationStatus: ModerationStatus
  reportReason: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  /**
   * Ordered image projections from the backend list endpoint.
   * Backend branch feature/expose-product-images-in-producer-list adds this.
   * Ordered by position ASC, createdAt ASC (DB-level, deterministic).
   * Primary thumbnail: images?.[0]?.url — may be undefined/empty for products
   * that have no uploaded images yet.
   */
  images?: ProductImageListDTO[]
}

// ---------------------------------------------------------------------------
// Report response DTO
// [source: products.controller.ts — reportProduct returns { productId, moderationStatus, reportedAt }]
// ---------------------------------------------------------------------------

export type ReportResponseDTO = {
  productId: string
  moderationStatus: ModerationStatus
  reportedAt: string | null
}

// ---------------------------------------------------------------------------
// Image presign response DTO
// [source: mercado-artesanal-backend/openspec/specs/product-images/spec.md]
// ---------------------------------------------------------------------------

export type PresignResponseDTO = {
  uploadUrl: string
  s3Key: string
  expiresIn: number
}

// ---------------------------------------------------------------------------
// Create product form schema — mirrors backend CreateProductSchema (strict)
// [frontend-defined; backend enforces .strict() — unknown keys → VALIDATION_FAILED]
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Create product form schema — input/output split for React Hook Form v7 + Zod v4
//
// Numeric fields use z.coerce.number() so that <input type="number" /> (which
// returns a string from the DOM) is coerced to a number by Zod at parse time.
// The form is typed with useForm<z.input<...>, unknown, z.output<...>> so RHF
// sees strings as input values (field state) and numbers as output values (the
// object passed to onSubmit). No valueAsNumber and no resolver casts needed.
// ---------------------------------------------------------------------------

export const createProductoFormSchema = z
  .object({
    categoryId: z.string().min(1, 'Selecciona una categoría.'),
    name: z.string().trim().min(1, 'El nombre del producto es obligatorio.'),
    description: z.string().trim().min(1, 'La descripción es obligatoria.'),
    /** price as a decimal string input — validated as parseable positive number */
    price: z
      .string()
      .min(1, 'El precio es obligatorio.')
      .regex(/^\d+(\.\d{1,2})?$/, 'El precio debe ser un número positivo con hasta 2 decimales.'),
    /** Coerced at parse time — DOM sends a string from <input type="number" /> */
    stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo.').optional(),
    lowStockThreshold: z.coerce
      .number()
      .int()
      .min(0, 'El umbral de stock bajo no puede ser negativo.')
      .optional(),
    ingredients: z.string().nullable().optional(),
    allergens: z.array(z.string()).optional(),
    weight: z.coerce.number().int().positive().nullable().optional(),
    presentation: z.string().nullable().optional(),
  })
  .strict()

/** Input type — what RHF holds in field state (strings from DOM inputs). */
export type CreateProductoFormInput = z.input<typeof createProductoFormSchema>
/** Output type — what Zod returns after coercion (numbers resolved). */
export type CreateProductoFormValues = z.output<typeof createProductoFormSchema>

// ---------------------------------------------------------------------------
// Update product form schema — all fields optional (PATCH partial)
// [frontend-defined; mirrors backend UpdateProductSchema]
// ---------------------------------------------------------------------------

export const updateProductoFormSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre del producto es obligatorio.').optional(),
    description: z.string().trim().min(1, 'La descripción es obligatoria.').optional(),
    price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'El precio debe ser un número positivo con hasta 2 decimales.')
      .optional(),
    /** Coerced at parse time — DOM sends a string from <input type="number" /> */
    stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo.').optional(),
    lowStockThreshold: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    ingredients: z.string().nullable().optional(),
    allergens: z.array(z.string()).optional(),
    weight: z.coerce.number().int().positive().nullable().optional(),
    presentation: z.string().nullable().optional(),
  })
  .strict()
  .partial()

/** Input type — what RHF holds in field state (strings from DOM inputs). */
export type UpdateProductoFormInput = z.input<typeof updateProductoFormSchema>
/** Output type — what Zod returns after coercion (numbers resolved). */
export type UpdateProductoFormValues = z.output<typeof updateProductoFormSchema>

// ---------------------------------------------------------------------------
// Report product form schema
// [frontend-defined; mirrors backend ReportProductSchema]
// ---------------------------------------------------------------------------

export const reportProductoFormSchema = z
  .object({
    reason: z.string().trim().min(1, 'El motivo es obligatorio.').max(500, 'El motivo no puede superar los 500 caracteres.'),
  })
  .strict()

export type ReportProductoFormValues = z.infer<typeof reportProductoFormSchema>

// ---------------------------------------------------------------------------
// Presign image request schema
// [frontend-defined; mirrors backend PresignBodySchema]
// ---------------------------------------------------------------------------

export const presignImageFormSchema = z
  .object({
    mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
      error: 'Tipo de imagen no permitido. Usa JPG, PNG o WebP.',
    }),
    contentLength: z.number().int().min(1).max(5 * 1024 * 1024, 'La imagen no puede superar los 5 MB.'),
  })
  .strict()

export type PresignImageFormValues = z.infer<typeof presignImageFormSchema>

// ---------------------------------------------------------------------------
// Confirm image request schema
// [frontend-defined; mirrors backend ConfirmBodySchema]
// ---------------------------------------------------------------------------

export const confirmImageFormSchema = z
  .object({
    s3Key: z.string().min(1),
    mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
    position: z.number().int().min(0),
  })
  .strict()

export type ConfirmImageFormValues = z.infer<typeof confirmImageFormSchema>
