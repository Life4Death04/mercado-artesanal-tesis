import { z } from 'zod'

// ---------------------------------------------------------------------------
// Enums (control-flow fields — edge-parsed at hook boundary)
// ---------------------------------------------------------------------------

export const UserRoleSchema = z.enum(['PENDING_ROLE', 'CONSUMER', 'PRODUCER', 'ADMIN'])
export type UserRole = z.infer<typeof UserRoleSchema>

// ---------------------------------------------------------------------------
// Authenticated producer profile (embedded in GET /api/v1/users/me response)
// [source: user-profile/spec.md — "GET /users/me — read current user"]
// ---------------------------------------------------------------------------

export type AuthenticatedProducerProfile = {
  id: string
  businessName: string
  nif: string          // read-only — backend rejects PATCH with VALIDATION_FAILED
  description: string
  address: {
    line1: string
    line2: string | null
    city: string
    postalCode: string  // ^\d{5}$
    province: string
    country: string     // default "ES"
  }
  categorySlugs: string[]
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// GET /api/v1/users/me → UserMeResponse
// [source: user-profile/spec.md]
// ---------------------------------------------------------------------------

export type UserMeResponse = {
  id: string
  email: string
  emailVerified: boolean
  name: string | null
  firstName: string | null
  lastName: string | null
  avatar: string | null
  role: UserRole            // control-flow field — edge-parsed by hook
  onboardingCompleted: boolean
  producer: AuthenticatedProducerProfile | null
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Public producer projection — GET /producers/:id (anonymous, PII-redacted)
// [source: producer-bootstrap/spec.md — "Public producer projection endpoint"]
// Out of scope for PR#1 wiring but declared here to prevent conflation.
// ---------------------------------------------------------------------------

export type PublicProducerProjection = {
  id: string
  businessName: string
  description: string
  address: {
    city: string
    province: string
    country: string
  }
  categories: Array<{ slug: string; name: string }>
  createdAt: string
}

// ---------------------------------------------------------------------------
// PATCH /producers/me — form contract
// [frontend-defined; mirrors backend .strict() policy]
// ---------------------------------------------------------------------------

export const producerProfileFormSchema = z
  .object({
    businessName: z.string().trim().min(1, 'El nombre de la tienda es obligatorio.'),
    description: z.string().trim().min(1, 'La descripción es obligatoria.'),
    address: z
      .object({
        line1: z.string().trim().min(1, 'La dirección es obligatoria.'),
        line2: z.string().nullable(),
        city: z.string().trim().min(1, 'La ciudad es obligatoria.'),
        postalCode: z
          .string()
          .regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos.'),
        province: z.string().trim().min(1, 'La provincia es obligatoria.'),
        country: z.string().trim().min(2, 'El país es obligatorio.'),
      })
      .partial(),
    categorySlugs: z.array(z.string()).min(1, 'Selecciona al menos una categoría.'),
  })
  .strict()   // mirror backend .strict() — reject unknown keys
  .partial()  // partial edit — all top-level fields optional

export type ProducerProfileFormValues = z.infer<typeof producerProfileFormSchema>
