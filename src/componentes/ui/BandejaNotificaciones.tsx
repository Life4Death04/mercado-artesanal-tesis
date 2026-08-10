import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  CircleAlert,
  CircleCheck,
  CreditCard,
  Package,
  Truck,
  X,
} from 'lucide-react'
import { NotificationReadBatchError } from '../../modules/notificaciones/notificaciones.api'
import {
  useMarkNotificationsReadMutation,
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
} from '../../modules/notificaciones/hooks/useNotifications'
import type { Notification } from '../../modules/notificaciones/notificaciones.schema'

type NotificationTrayVariant = 'admin' | 'consumer' | 'producer'

export function BandejaNotificaciones({
  variant = 'consumer',
}: {
  variant?: NotificationTrayVariant
}) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const processedUnreadIdsRef = useRef(new Set<string>())
  const notificationsQuery = useNotificationsQuery()
  const unreadCountQuery = useUnreadNotificationCountQuery()
  const markReadMutation = useMarkNotificationsReadMutation()
  const unreadCount = unreadCountQuery.data?.count ?? 0
  const unreadCountUnavailable = unreadCountQuery.isError || unreadCountQuery.isRefetchError
  const usesLightTrigger = variant !== 'producer'

  useEffect(() => {
    if (!isOpen) return

    const triggerElement = triggerRef.current
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      triggerElement?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (
      !isOpen ||
      markReadMutation.isPending ||
      markReadMutation.isError ||
      !notificationsQuery.data
    ) return

    const unreadIds = notificationsQuery.data
      .filter(
        (notification) =>
          !notification.read && !processedUnreadIdsRef.current.has(notification.id),
      )
      .map((notification) => notification.id)

    if (unreadIds.length === 0) return

    unreadIds.forEach((id) => processedUnreadIdsRef.current.add(id))
    markReadMutation.mutate(unreadIds)
  }, [isOpen, markReadMutation, notificationsQuery.data])

  function toggleTray() {
    if (!isOpen && !markReadMutation.isPending) {
      processedUnreadIdsRef.current.clear()
      markReadMutation.reset()
    }

    setIsOpen((current) => !current)
  }

  function closeTray() {
    setIsOpen(false)
  }

  const triggerClassName = usesLightTrigger
    ? 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-primary)]'
    : 'text-[var(--color-on-primary)] hover:bg-white/12'

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Notificaciones${unreadCountUnavailable ? ', contador no disponible' : unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={toggleTray}
        className={`relative rounded-full p-2 transition-all duration-150 active:scale-95 ${triggerClassName}`}
      >
        <Bell size={22} strokeWidth={1.8} />
        {unreadCountUnavailable ? (
          <span
            aria-hidden="true"
            className={`absolute top-0 right-0 grid size-5 place-items-center rounded-full text-[11px] font-bold ${
              variant === 'producer'
                ? 'bg-white text-[var(--color-error)] ring-2 ring-[var(--color-primary-container)]'
                : 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)] ring-2 ring-[var(--color-background)]'
            }`}
          >
            !
          </span>
        ) : unreadCount > 0 ? (
          <span
            aria-hidden="true"
            className={`absolute top-0 right-0 grid size-5 place-items-center rounded-full text-[10px] font-bold ${
              variant === 'producer'
                ? 'bg-white text-[var(--color-primary-container)] ring-2 ring-[var(--color-primary-container)]'
                : 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)] ring-2 ring-[var(--color-background)]'
            }`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Cerrar bandeja de notificaciones"
            className="fixed inset-0 z-40 cursor-default bg-[var(--color-on-surface)]/20 backdrop-blur-sm"
            onClick={closeTray}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-tray-title"
            className="absolute top-12 right-0 z-50 w-[min(calc(100vw-2rem),400px)] overflow-hidden border border-[var(--color-outline-variant)] bg-[var(--color-background)] shadow-[0_10px_30px_-10px_rgba(122,46,58,0.16)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--color-outline-variant)] px-5 py-5 sm:px-6">
              <div>
                <h2
                  id="notification-tray-title"
                  className="text-headline-md text-[var(--color-on-surface)]"
                >
                  Notificaciones
                </h2>
                {markReadMutation.isPending ? (
                  <p className="text-label-sm mt-1 text-[var(--color-on-surface-variant)]" role="status">
                    Marcando como leídas...
                  </p>
                ) : null}
                {unreadCountUnavailable ? (
                  <p className="text-label-sm mt-1 text-[var(--color-error)]" role="status">
                    Contador no disponible temporalmente.
                  </p>
                ) : null}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Cerrar notificaciones"
                onClick={closeTray}
                className="grid size-9 shrink-0 place-items-center rounded-full text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-on-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            {markReadMutation.error ? (
              <div
                role="alert"
                className="border-b border-[var(--color-error)]/20 bg-[var(--color-error-container)] px-5 py-3 text-sm text-[var(--color-on-error-container)] sm:px-6"
              >
                {markReadMutation.error instanceof NotificationReadBatchError
                  ? `No se pudieron actualizar ${markReadMutation.error.failedIds.length} notificaciones. Se han vuelto a sincronizar.`
                  : 'No se pudieron actualizar las notificaciones. Se han vuelto a sincronizar.'}
              </div>
            ) : null}

            <NotificationList
              notifications={notificationsQuery.data ?? []}
              isLoading={notificationsQuery.isLoading}
              isError={notificationsQuery.isError}
              onRetry={() => void notificationsQuery.refetch()}
            />

            {!notificationsQuery.isLoading && !notificationsQuery.isError && notificationsQuery.data && notificationsQuery.data.length > 0 ? (
              <p className="border-t border-[var(--color-outline-variant)] bg-white px-4 py-3 text-center text-[11px] font-medium tracking-[0.14em] text-[var(--color-on-surface-variant)] uppercase">
                Mostrando las notificaciones recientes
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}

function NotificationList({
  notifications,
  isLoading,
  isError,
  onRetry,
}: {
  notifications: Notification[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}) {
  if (isLoading) {
    return (
      <div className="grid min-h-48 place-items-center px-6 py-10" role="status">
        <div className="text-center">
          <span className="mx-auto mb-3 block size-7 animate-spin rounded-full border-2 border-[var(--color-outline-variant)] border-t-[var(--color-primary)]" />
          <p className="text-body-md text-[var(--color-on-surface-variant)]">Cargando notificaciones...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-6 py-10 text-center" role="alert">
        <CircleAlert className="mx-auto mb-3 text-[var(--color-error)]" size={30} strokeWidth={1.5} />
        <p className="text-body-md text-[var(--color-on-surface)]">No se pudieron cargar las notificaciones.</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-label-sm mt-4 rounded-sm border border-[var(--color-outline-variant)] px-4 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-container-low)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <Bell size={32} strokeWidth={1.4} className="mx-auto mb-3 text-[var(--color-outline)]" />
        <p className="text-body-md text-[var(--color-on-surface-variant)]">No tienes notificaciones.</p>
      </div>
    )
  }

  return (
    <ul
      className="max-h-[min(480px,calc(100vh-13rem))] overflow-y-auto"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#d0c5b4 transparent' }}
      aria-label="Notificaciones recientes"
    >
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </ul>
  )
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <li
      className={`flex gap-3 border-b border-[var(--color-outline-variant)] px-5 py-4 sm:gap-4 sm:px-6 sm:py-5 ${
        notification.read
          ? 'opacity-80'
          : 'bg-[var(--color-surface-container-lowest)]/60'
      }`}
    >
      <NotificationIcon type={notification.type} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-3">
          <p className="text-label-md font-semibold leading-snug text-[var(--color-on-surface)]">
            {notification.title}
          </p>
          <time
            dateTime={notification.createdAt}
            title={formatFullDate(notification.createdAt)}
            className="text-label-sm shrink-0 text-[var(--color-on-surface-variant)]"
          >
            {formatNotificationDate(notification.createdAt)}
          </time>
        </div>
        <p className="text-sm leading-5 text-[var(--color-on-surface-variant)]">
          {notification.body}
        </p>
      </div>
      <span className="flex w-2 shrink-0 items-center">
        <span className="sr-only">Estado: {notification.read ? 'leída' : 'no leída'}.</span>
        {!notification.read ? <span aria-hidden="true" className="size-2 rounded-full bg-[var(--color-primary-container)]" /> : null}
      </span>
    </li>
  )
}

function NotificationIcon({ type }: { type: string }): ReactNode {
  const iconClassName = 'flex size-10 shrink-0 items-center justify-center rounded-full'

  switch (type) {
    case 'PAYMENT_CONFIRMED':
      return <span className={`${iconClassName} bg-green-900/5 text-green-800`}><CreditCard size={20} strokeWidth={1.6} /></span>
    case 'ORDER_CREATED':
      return <span className={`${iconClassName} bg-[var(--color-primary)]/5 text-[var(--color-primary)]`}><Package size={20} strokeWidth={1.6} /></span>
    case 'SUBORDER_STATUS_CHANGED':
    case 'TRACKING_ASSIGNED':
      return <span className={`${iconClassName} bg-[var(--color-secondary)]/8 text-[var(--color-secondary)]`}><Truck size={20} strokeWidth={1.6} /></span>
    case 'INCIDENT_REPORTED':
      return <span className={`${iconClassName} bg-[var(--color-error)]/5 text-[var(--color-error)]`}><CircleAlert size={20} strokeWidth={1.6} /></span>
    case 'INCIDENT_RESOLVED':
      return <span className={`${iconClassName} bg-green-900/5 text-green-800`}><CircleCheck size={20} strokeWidth={1.6} /></span>
    default:
      return <span className={`${iconClassName} bg-[var(--color-tertiary)]/5 text-[var(--color-tertiary)]`}><Bell size={20} strokeWidth={1.6} /></span>
  }
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
const shortDateFormatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' })
const fullDateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatNotificationDate(value: string): string {
  const date = new Date(value)
  const differenceInSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absoluteSeconds = Math.abs(differenceInSeconds)

  if (absoluteSeconds < 60) return 'Ahora'
  if (absoluteSeconds < 3_600) return relativeTimeFormatter.format(Math.round(differenceInSeconds / 60), 'minute')
  if (absoluteSeconds < 86_400) return relativeTimeFormatter.format(Math.round(differenceInSeconds / 3_600), 'hour')
  if (absoluteSeconds < 604_800) return relativeTimeFormatter.format(Math.round(differenceInSeconds / 86_400), 'day')
  return shortDateFormatter.format(date)
}

function formatFullDate(value: string): string {
  return fullDateFormatter.format(new Date(value))
}
