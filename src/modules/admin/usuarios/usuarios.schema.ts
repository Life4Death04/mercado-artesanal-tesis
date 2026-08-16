import { z } from 'zod'

export const adminUserRoleSchema = z.enum(['CONSUMER', 'PRODUCER'])
export const adminUserStatusSchema = z.enum(['ACTIVE', 'DEACTIVATED', 'DELETED'])

export const adminUsersQuerySchema = z
  .object({
    page: z.number().int().min(1).default(1),
    search: z.string().trim().min(1).optional(),
    role: adminUserRoleSchema.optional(),
    status: adminUserStatusSchema.optional(),
  })
  .strict()

export const adminUserSummarySchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    name: z.string().nullable(),
    role: adminUserRoleSchema,
    status: adminUserStatusSchema,
    createdAt: z.string(),
    producerId: z.string().nullable(),
    businessName: z.string().nullable(),
  })
  .strict()

export const adminUserActivitySchema = z
  .object({
    orderCount: z.number().int().nonnegative(),
    publishedProductCount: z.number().int().nonnegative(),
    activeOrderCount: z.number().int().nonnegative(),
  })
  .strict()

export const adminUserDetailSchema = adminUserSummarySchema
  .extend({
    emailVerified: z.boolean(),
    avatar: z.string().nullable(),
    updatedAt: z.string(),
    activity: adminUserActivitySchema,
  })
  .strict()

export const adminUsersPageSchema = z
  .object({
    items: z.array(adminUserSummarySchema),
    page: z.number().int().min(1),
    pageSize: z.literal(8),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  .strict()

export type AdminUserRole = z.infer<typeof adminUserRoleSchema>
export type AdminUserStatus = z.infer<typeof adminUserStatusSchema>
export type AdminUsersQuery = z.input<typeof adminUsersQuerySchema>
export type AdminUserSummary = z.infer<typeof adminUserSummarySchema>
export type AdminUserActivity = z.infer<typeof adminUserActivitySchema>
export type AdminUserDetail = z.infer<typeof adminUserDetailSchema>
export type AdminUsersPage = z.infer<typeof adminUsersPageSchema>

export function getAdminUserDisplayName(user: AdminUserSummary): string {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return user.businessName?.trim() || user.name?.trim() || fullName || user.email
}
