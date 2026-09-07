import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../../auth/hooks/useAuthenticatedApi'
import {
  activateAdminUser,
  deactivateAdminUser,
  deleteAdminUser,
  getAdminUserDetail,
  getAdminUsers,
} from '../usuarios.api'
import { adminUserKeys } from '../usuarios.queryKeys'
import type { AdminUserDetail, AdminUsersQuery } from '../usuarios.schema'

export function useAdminUsersQuery(query: AdminUsersQuery) {
  const api = useAuthenticatedApi()

  return useQuery({
    queryKey: adminUserKeys.list(query),
    queryFn: ({ signal }) => getAdminUsers(api, query, signal),
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useAdminUserDetailQuery(userId: string) {
  const api = useAuthenticatedApi()

  return useQuery({
    queryKey: adminUserKeys.detail(userId),
    queryFn: ({ signal }) => getAdminUserDetail(api, userId, signal),
    retry: false,
    refetchOnWindowFocus: false,
  })
}

function useLifecycleMutation(
  mutationFn: (api: ReturnType<typeof useAuthenticatedApi>, userId: string) => Promise<AdminUserDetail>,
) {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => mutationFn(api, userId),
    onSuccess: async (user) => {
      queryClient.setQueryData(adminUserKeys.detail(user.id), user)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(user.id) }),
      ])
    },
  })
}

export function useActivateAdminUserMutation() {
  return useLifecycleMutation(activateAdminUser)
}

export function useDeactivateAdminUserMutation() {
  return useLifecycleMutation(deactivateAdminUser)
}

export function useDeleteAdminUserMutation() {
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(api, userId),
    onSuccess: async (_, userId) => {
      queryClient.removeQueries({ queryKey: adminUserKeys.detail(userId) })
      await queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() })
    },
  })
}
