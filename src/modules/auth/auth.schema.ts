import { z } from 'zod'
import type { CurrentUser } from './auth.types'

const producerViewSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  nif: z.string(),
  description: z.string(),
  address: z.object({
    line1: z.string(),
    line2: z.string().nullable(),
    city: z.string(),
    postalCode: z.string(),
    province: z.string(),
    country: z.string(),
  }),
  categorySlugs: z.array(z.string()),
})

export const currentUserSchema: z.ZodType<CurrentUser> = z.object({
  id: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  name: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  avatar: z.string().nullable(),
  role: z.enum(['PENDING_ROLE', 'CONSUMER', 'PRODUCER', 'ADMIN']),
  onboardingCompleted: z.boolean(),
  producer: producerViewSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
