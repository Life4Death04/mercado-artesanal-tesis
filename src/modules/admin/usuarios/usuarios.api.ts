import {
  adminUserDetailSchema,
  adminUsersPageSchema,
  adminUsersQuerySchema,
  type AdminUserDetail,
  type AdminUsersPage,
  type AdminUsersQuery,
} from './usuarios.schema'

export const adminUserEndpoints = {
  list: '/admin/users',
  detail: (userId: string) => `/admin/users/${userId}`,
  activate: (userId: string) => `/admin/users/${userId}/activate`,
  deactivate: (userId: string) => `/admin/users/${userId}/deactivate`,
} as const

type ApiCaller = <TResponse>(
  path: string,
  options?: { method?: string; signal?: AbortSignal },
) => Promise<TResponse>

export async function getAdminUsers(
  api: ApiCaller,
  query: AdminUsersQuery,
  signal?: AbortSignal,
): Promise<AdminUsersPage> {
  const parsedQuery = adminUsersQuerySchema.parse(query)
  const searchParams = new URLSearchParams({ page: String(parsedQuery.page) })

  if (parsedQuery.search) searchParams.set('search', parsedQuery.search)
  if (parsedQuery.role) searchParams.set('role', parsedQuery.role)
  if (parsedQuery.status) searchParams.set('status', parsedQuery.status)

  return adminUsersPageSchema.parse(
    await api<unknown>(`${adminUserEndpoints.list}?${searchParams.toString()}`, { signal }),
  )
}

export async function getAdminUserDetail(
  api: ApiCaller,
  userId: string,
  signal?: AbortSignal,
): Promise<AdminUserDetail> {
  return adminUserDetailSchema.parse(
    await api<unknown>(adminUserEndpoints.detail(userId), { signal }),
  )
}

export async function activateAdminUser(api: ApiCaller, userId: string): Promise<AdminUserDetail> {
  return adminUserDetailSchema.parse(
    await api<unknown>(adminUserEndpoints.activate(userId), { method: 'PATCH' }),
  )
}

export async function deactivateAdminUser(api: ApiCaller, userId: string): Promise<AdminUserDetail> {
  return adminUserDetailSchema.parse(
    await api<unknown>(adminUserEndpoints.deactivate(userId), { method: 'PATCH' }),
  )
}

export async function deleteAdminUser(api: ApiCaller, userId: string): Promise<void> {
  await api<void>(adminUserEndpoints.detail(userId), { method: 'DELETE' })
}
