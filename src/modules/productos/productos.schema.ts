import { z } from 'zod'

const decimalStringSchema = z.string().regex(/^\d+(\.\d+)?$/, 'price must be a Decimal string')

export const publicCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const publicCategoriesSchema = z.array(publicCategorySchema)

export const publicProductImageSchema = z.object({
  id: z.string(),
  position: z.number().int(),
  url: z.string().url(),
})

export const publicProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: decimalStringSchema,
  stock: z.number().int().min(0),
  ingredients: z.string().nullable(),
  allergens: z.array(z.string()),
  weight: z.number().int().nullable(),
  presentation: z.string().nullable(),
  categoryId: z.string(),
  createdAt: z.iso.datetime(),
  images: z.array(publicProductImageSchema),
  category: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
  }),
  producer: z.object({
    id: z.string(),
    businessName: z.string(),
    description: z.string(),
    address: z.object({
      city: z.string(),
      province: z.string(),
      country: z.string(),
    }),
  }),
})

export const publicProductsSchema = z.array(publicProductSchema)

export type PublicProduct = z.infer<typeof publicProductSchema>
export type PublicCategory = z.infer<typeof publicCategorySchema>

export type PublicProductsQuery = {
  categoryId?: string
  available?: boolean
  sort?: 'asc' | 'desc'
}
