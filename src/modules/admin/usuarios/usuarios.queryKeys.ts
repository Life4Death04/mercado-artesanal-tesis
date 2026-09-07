import type { AdminUsersQuery } from './usuarios.schema'

export const adminUserKeys = {
  all: ['admin', 'users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (query: AdminUsersQuery) => [...adminUserKeys.lists(), query] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (userId: string) => [...adminUserKeys.details(), userId] as const,
} as const
