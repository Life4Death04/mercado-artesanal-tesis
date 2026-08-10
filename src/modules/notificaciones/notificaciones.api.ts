import type { ApiRequestOptions } from '../../lib/api'
import {
  notificationSchema,
  notificationsSchema,
  unreadCountSchema,
  type Notification,
  type UnreadCount,
} from './notificaciones.schema'

type ApiCaller = <TResponse>(path: string, options?: Omit<ApiRequestOptions, 'accessToken'>) => Promise<TResponse>

export const notificationEndpoints = {
  list: '/notifications',
  unreadCount: '/notifications/unread-count',
  markRead: (id: string) => `/notifications/${encodeURIComponent(id)}/read`,
} as const

export async function getNotifications(api: ApiCaller, signal?: AbortSignal): Promise<Notification[]> {
  const response = await api<unknown>(notificationEndpoints.list, { signal })
  return notificationsSchema.parse(response)
}

export async function getUnreadNotificationCount(api: ApiCaller, signal?: AbortSignal): Promise<UnreadCount> {
  const response = await api<unknown>(notificationEndpoints.unreadCount, { signal })
  return unreadCountSchema.parse(response)
}

export async function markNotificationRead(api: ApiCaller, id: string): Promise<Notification> {
  const response = await api<unknown>(notificationEndpoints.markRead(id), { method: 'PATCH' })
  return notificationSchema.parse(response)
}

export class NotificationReadBatchError extends Error {
  public readonly failedIds: string[]

  constructor(failedIds: string[]) {
    super('No se pudieron marcar todas las notificaciones como leídas')
    this.name = 'NotificationReadBatchError'
    this.failedIds = failedIds
  }
}

export async function markNotificationsRead(api: ApiCaller, ids: string[]): Promise<void> {
  const failedIds: string[] = []
  const concurrency = 4

  for (let index = 0; index < ids.length; index += concurrency) {
    const batch = ids.slice(index, index + concurrency)
    const results = await Promise.allSettled(batch.map((id) => markNotificationRead(api, id)))

    results.forEach((result, resultIndex) => {
      if (result.status === 'rejected') failedIds.push(batch[resultIndex])
    })
  }

  if (failedIds.length > 0) throw new NotificationReadBatchError(failedIds)
}
