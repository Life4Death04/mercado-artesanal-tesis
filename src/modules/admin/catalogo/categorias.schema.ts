import { z } from 'zod'

export const adminCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  productCount: z.number().int().nonnegative(),
})

export const adminCategoryListSchema = z.array(adminCategorySchema)

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, 'El nombre de la categoría es obligatorio.')
  .max(120, 'El nombre no puede superar los 120 caracteres.')

const categoryDescriptionSchema = z
  .string()
  .trim()
  .min(1, 'La descripción no puede contener solo espacios.')
  .max(1000, 'La descripción no puede superar los 1000 caracteres.')

export const createAdminCategoryInputSchema = z.object({
  name: categoryNameSchema,
  description: categoryDescriptionSchema.optional(),
})

export const updateAdminCategoryInputSchema = z.object({
  name: categoryNameSchema.optional(),
  description: categoryDescriptionSchema.nullable().optional(),
  isActive: z.boolean().optional(),
})

export type AdminCategory = z.infer<typeof adminCategorySchema>
export type CreateAdminCategoryInput = z.infer<typeof createAdminCategoryInputSchema>
export type UpdateAdminCategoryInput = z.infer<typeof updateAdminCategoryInputSchema>
