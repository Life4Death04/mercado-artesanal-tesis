export const notificationKeys = {
  all: (authIdentity: string) => ['notifications', authIdentity] as const,
  list: (authIdentity: string) => [...notificationKeys.all(authIdentity), 'list'] as const,
  unreadCount: (authIdentity: string) => [...notificationKeys.all(authIdentity), 'unread-count'] as const,
}
