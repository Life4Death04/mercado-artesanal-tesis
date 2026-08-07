import { z } from 'zod'

/**
 * Wire shape for GET/POST/PATCH `/users/me/addresses` — verified against
 * `src/modules/addresses/{controllers,services}/addresses.*.ts` and the
 * Prisma `Address` model in the backend repository. Fields not consumed by
 * the UI (`userId`, `createdAt`, `updatedAt`, `deletedAt`) are parsed with
 * `.passthrough()` so an unexpected backend addition never breaks parsing.
 */
export const addressSchema = z
  .object({
    id: z.string(),
    line1: z.string(),
    line2: z.string().nullable(),
    city: z.string(),
    postalCode: z.string(),
    province: z.string(),
    country: z.string(),
    isDefault: z.boolean(),
  })
  .passthrough()

export const addressListSchema = z.array(addressSchema)

export type Address = z.infer<typeof addressSchema>

const SPANISH_POSTAL_CODE_REGEX = /^\d{5}$/

/**
 * Request body for `POST /users/me/addresses`. Mirrors the backend
 * `AddressBaseSchema` (line1/city/province required, line2 nullable,
 * postalCode 5-digit Spanish format, country optional/defaults to `ES`).
 */
export const createAddressInputSchema = z.object({
  line1: z.string().trim().min(1, 'La calle y el número son obligatorios'),
  line2: z.string().trim().min(1).nullable().optional(),
  city: z.string().trim().min(1, 'La localidad es obligatoria'),
  postalCode: z.string().trim().regex(SPANISH_POSTAL_CODE_REGEX, 'Debe ser un código postal español de 5 dígitos'),
  province: z.string().trim().min(1, 'La provincia es obligatoria'),
  country: z.string().length(2).optional(),
  isDefault: z.boolean().optional(),
})

export type CreateAddressInput = z.infer<typeof createAddressInputSchema>

/** Request body for `PATCH /users/me/addresses/:id` — every field optional. */
export const updateAddressInputSchema = createAddressInputSchema.partial()

export type UpdateAddressInput = z.infer<typeof updateAddressInputSchema>
