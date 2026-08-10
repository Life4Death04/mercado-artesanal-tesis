import { z } from 'zod'

export const knownNotificationTypeSchema = z.enum([
  'PAYMENT_CONFIRMED',
  'ORDER_CREATED',
  'SUBORDER_STATUS_CHANGED',
  'TRACKING_ASSIGNED',
  'INCIDENT_REPORTED',
  'INCIDENT_RESOLVED',
])

export const notificationSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  title: z.string(),
  body: z.string(),
  data: z.unknown().nullable(),
  read: z.boolean(),
  readAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
})

export const notificationsSchema = z.array(notificationSchema).max(50)

export const unreadCountSchema = z.object({
  count: z.number().int().min(0),
})

export type Notification = z.infer<typeof notificationSchema>
export type KnownNotificationType = z.infer<typeof knownNotificationTypeSchema>
export type UnreadCount = z.infer<typeof unreadCountSchema>
