import {
  adminCategoryListSchema,
  adminCategorySchema,
  createAdminCategoryInputSchema,
  updateAdminCategoryInputSchema,
  type AdminCategory,
  type CreateAdminCategoryInput,
  type UpdateAdminCategoryInput,
} from './categorias.schema'

export const adminCategoryEndpoints = {
  list: '/admin/categories',
  detail: (categoryId: string) => `/admin/categories/${categoryId}`,
} as const

type ApiCaller = <TResponse>(
  path: string,
  options?: { method?: string; body?: unknown; signal?: AbortSignal },
) => Promise<TResponse>

export async function getAdminCategories(
  api: ApiCaller,
  signal?: AbortSignal,
): Promise<AdminCategory[]> {
  return adminCategoryListSchema.parse(
    await api<unknown>(adminCategoryEndpoints.list, { signal }),
  )
}

export async function createAdminCategory(
  api: ApiCaller,
  input: CreateAdminCategoryInput,
): Promise<AdminCategory> {
  const body = createAdminCategoryInputSchema.parse(input)
  const category = adminCategorySchema.omit({ productCount: true }).parse(
    await api<unknown>(adminCategoryEndpoints.list, { method: 'POST', body }),
  )

  return { ...category, productCount: 0 }
}

export async function updateAdminCategory(
  api: ApiCaller,
  categoryId: string,
  input: UpdateAdminCategoryInput,
): Promise<AdminCategory> {
  const body = updateAdminCategoryInputSchema.parse(input)
  const category = adminCategorySchema.omit({ productCount: true }).parse(
    await api<unknown>(adminCategoryEndpoints.detail(categoryId), { method: 'PATCH', body }),
  )

  return { ...category, productCount: 0 }
}

export async function deactivateAdminCategory(api: ApiCaller, categoryId: string): Promise<void> {
  await api(adminCategoryEndpoints.detail(categoryId), { method: 'DELETE' })
}
