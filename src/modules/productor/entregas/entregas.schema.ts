import { z } from 'zod'

// ---------------------------------------------------------------------------
// DeliveryModeType enum — control-flow enum; edge-parsed at hook boundary
// [source: mercado-artesanal-backend/openspec/specs/delivery-modes/spec.md]
//
// "DeliveryMode.type (enum DeliveryModeType): PICKUP | SHIPPING_FLAT_RATE"
// Unknown values → schema parse error → fail closed (spec R6).
// ---------------------------------------------------------------------------

export const DeliveryModeTypeSchema = z.enum(['PICKUP', 'SHIPPING_FLAT_RATE'], {
  error: 'Tipo de modalidad de entrega desconocido.',
})

export type DeliveryModeType = z.infer<typeof DeliveryModeTypeSchema>

// ---------------------------------------------------------------------------
// DeliveryMode DTO — response shape for GET /producers/me/delivery-modes
// [source: mercado-artesanal-backend/openspec/specs/delivery-modes/spec.md]
//
// money-typing R1–R3: price fields (e.g. flatRate) are strings from Prisma Decimal.
// NEVER perform arithmetic on monetary string fields client-side.
// ---------------------------------------------------------------------------

export type DeliveryModeDTO = {
  id: string
  producerId: string
  /** Control-flow enum — edge-parsed in the API layer to guard display branches. */
  type: DeliveryModeType
  isActive: boolean
  /**
   * Flat shipping rate as a Decimal string from Prisma.
   * Display via formatMoney(). NEVER parse for math.
   * Present only when type === 'SHIPPING_FLAT_RATE'; null for PICKUP.
   */
  flatRate: string | null
  /** Coverage scope description entered by the producer (e.g. "Nacional"). */
  coverageScope: string | null
  /** Pickup-specific: name of the pickup location. */
  locationName: string | null
  /** Pickup-specific: full address of the pickup point. */
  locationAddress: string | null
  /** Pickup-specific: opening hours note. */
  openingHours: string | null
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// UpdateDeliveryMode request DTO — PATCH /producers/me/delivery-modes/:id
// [frontend-defined; mirrors backend UpdateDeliveryModeSchema partial strict]
// ---------------------------------------------------------------------------

export type UpdateDeliveryModePayload = {
  isActive?: boolean
  flatRate?: string
  coverageScope?: string | null
  locationName?: string | null
  locationAddress?: string | null
  openingHours?: string | null
}

// ---------------------------------------------------------------------------
// Delivery mode form schema — input/output generics for React Hook Form v7
//
// All monetary fields are z.string() — we never coerce or parse money values
// client-side (money-typing R1–R3 lock). The isActive toggle is a boolean
// (checkbox / RHF Controller), not a DOM string input.
// ---------------------------------------------------------------------------

export const deliveryModeFormSchema = z
  .object({
    isActive: z.boolean(),
    /**
     * Flat shipping rate — string input matching /^\d+([.,]\d{1,2})?$/.
     * Backend stores as Decimal; we send the string as-is after validation.
     * Money-typing R1: zero math here. Null/empty = cleared field.
     */
    flatRate: z
      .string()
      .regex(
        /^\d+([.,]\d{1,2})?$/,
        'El coste base debe ser un número positivo con hasta 2 decimales.',
      )
      .nullable()
      .optional(),
    coverageScope: z.string().trim().max(200).nullable().optional(),
    locationName: z.string().trim().max(200).nullable().optional(),
    locationAddress: z.string().trim().max(500).nullable().optional(),
    openingHours: z.string().trim().max(200).nullable().optional(),
  })
  .strict()

export type DeliveryModeFormInput = z.input<typeof deliveryModeFormSchema>
export type DeliveryModeFormValues = z.output<typeof deliveryModeFormSchema>

// ---------------------------------------------------------------------------
// Pickup point form schema — used in AgregarPuntoModal when wired to Zod
// [frontend-defined]
// ---------------------------------------------------------------------------

export const pickupPointFormSchema = z
  .object({
    nombre: z.string().trim().min(1, 'El nombre del punto es obligatorio.'),
    calle: z.string().trim().min(1, 'La calle es obligatoria.'),
    municipio: z.string().trim().min(1, 'El municipio es obligatorio.'),
    codigoPostal: z
      .string()
      .regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos.'),
    horario: z.string().trim().min(1, 'El horario es obligatorio.'),
    indicaciones: z.string().trim().nullable().optional(),
  })
  .strict()

export type PickupPointFormValues = z.output<typeof pickupPointFormSchema>
