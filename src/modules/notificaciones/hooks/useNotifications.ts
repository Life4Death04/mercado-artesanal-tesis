import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedApi } from '../../auth/hooks/useAuthenticatedApi'
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsRead,
} from '../notificaciones.api'
import { notificationKeys } from '../notificaciones.queryKeys'
import type { Notification, UnreadCount } from '../notificaciones.schema'

const DEMO_POLL_INTERVAL_MS = 30_000

export function useNotificationsQuery() {
  const { isAuthenticated, isLoading, user } = useAuth0()
  const api = useAuthenticatedApi()
  const authIdentity = user?.sub ?? 'unresolved'

  return useQuery({
    queryKey: notificationKeys.list(authIdentity),
    enabled: isAuthenticated && !isLoading && Boolean(user?.sub),
    retry: false,
    refetchInterval: DEMO_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    queryFn: ({ signal }) => getNotifications(api, signal),
  })
}

export function useUnreadNotificationCountQuery() {
  const { isAuthenticated, isLoading, user } = useAuth0()
  const api = useAuthenticatedApi()
  const authIdentity = user?.sub ?? 'unresolved'

  return useQuery({
    queryKey: notificationKeys.unreadCount(authIdentity),
    enabled: isAuthenticated && !isLoading && Boolean(user?.sub),
    retry: false,
    refetchInterval: DEMO_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    queryFn: ({ signal }) => getUnreadNotificationCount(api, signal),
  })
}

export function useMarkNotificationsReadMutation() {
  const { user } = useAuth0()
  const api = useAuthenticatedApi()
  const queryClient = useQueryClient()
  const authIdentity = user?.sub ?? 'unresolved'

  return useMutation({
    mutationFn: (ids: string[]) => markNotificationsRead(api, ids),
    onMutate: async (ids) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationKeys.list(authIdentity) }),
        queryClient.cancelQueries({ queryKey: notificationKeys.unreadCount(authIdentity) }),
      ])

      queryClient.setQueryData<Notification[]>(notificationKeys.list(authIdentity), (notifications) =>
        notifications?.map((notification) =>
          ids.includes(notification.id)
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification,
        ),
      )
      queryClient.setQueryData<UnreadCount>(notificationKeys.unreadCount(authIdentity), (current) =>
        current ? { count: Math.max(0, current.count - ids.length) } : current,
      )
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationKeys.list(authIdentity) }),
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(authIdentity) }),
      ])
    },
  })
}
