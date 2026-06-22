import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, Info, ShoppingBag } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificacionTipo = 'pedido' | 'incidencia' | 'entrega' | 'sistema'

export type Notificacion = {
  id: string
  tipo: NotificacionTipo
  titulo: string
  descripcion: string
  tiempo: string
  leida: boolean
}

// ---------------------------------------------------------------------------
// Mock data — replace with real data source when backend is ready
// ---------------------------------------------------------------------------

const notificacionesMock: Notificacion[] = [
  {
    id: 'notif-1',
    tipo: 'pedido',
    titulo: 'Pedido #AG-8821',
    descripcion: 'Tu pedido ha sido enviado y está en camino.',
    tiempo: 'Hace 2h',
    leida: false,
  },
  {
    id: 'notif-2',
    tipo: 'incidencia',
    titulo: 'Incidencia #INC-442',
    descripcion: 'Tu incidencia ha pasado a revisión por nuestro equipo.',
    tiempo: 'Ayer',
    leida: true,
  },
  {
    id: 'notif-3',
    tipo: 'entrega',
    titulo: 'Pedido #AG-7540',
    descripcion: 'Tu pedido ha sido entregado exitosamente.',
    tiempo: 'Hace 3 días',
    leida: true,
  },
]

// ---------------------------------------------------------------------------
// Icon resolver per notification type
// ---------------------------------------------------------------------------

function NotificacionIcono({ tipo }: { tipo: NotificacionTipo }): ReactNode {
  const base = 'flex size-10 flex-shrink-0 items-center justify-center rounded-full'

  switch (tipo) {
    case 'pedido':
      return (
        <div className={`${base} bg-[var(--color-primary)]/5 text-[var(--color-primary)]`}>
          <ShoppingBag size={20} strokeWidth={1.6} />
        </div>
      )
    case 'incidencia':
      return (
        <div className={`${base} bg-[var(--color-secondary)]/5 text-[var(--color-secondary)]`}>
          <Info size={20} strokeWidth={1.6} />
        </div>
      )
    case 'entrega':
      return (
        <div className={`${base} bg-green-900/5 text-green-800`}>
          <ShoppingBag size={20} strokeWidth={1.6} />
        </div>
      )
    case 'sistema':
    default:
      return (
        <div className={`${base} bg-[var(--color-tertiary)]/5 text-[var(--color-tertiary)]`}>
          <Bell size={20} strokeWidth={1.6} />
        </div>
      )
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * BandejaNotificaciones
 *
 * Self-contained notification bell trigger + dropdown panel.
 * Shared across all three user roles (Consumidor, Productor, Administrador).
 *
 * Usage: drop this anywhere inside a header/navbar.
 *
 * @example
 * <BandejaNotificaciones />
 *
 * @example with custom notifications
 * <BandejaNotificaciones notificaciones={misNotificaciones} />
 */
export function BandejaNotificaciones({
  notificaciones = notificacionesMock,
}: {
  notificaciones?: Notificacion[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState(notificaciones)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = items.filter((n) => !n.leida).length

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, leida: true })))
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* ── Trigger ── */}
      <button
        type="button"
        aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-full p-2 text-[var(--color-on-surface-variant)] transition-all duration-150 hover:bg-[var(--color-surface-container-low)] active:scale-95"
      >
        <Bell size={22} strokeWidth={1.6} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-[#7A2E3A] text-[10px] font-bold text-white ring-2 ring-[var(--color-surface)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* ── Overlay ── */}
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-[var(--color-on-surface)]/20 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* ── Panel ── */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Bandeja de notificaciones"
            className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden border border-[var(--color-outline-variant)] bg-[#FAF7F0] shadow-[0_10px_30px_-10px_rgba(122,46,58,0.08)] sm:w-[400px]"
            style={{ animation: 'notifSlideIn 0.22s ease-out forwards' }}
          >
            {/* Panel header */}
            <div className="flex items-baseline justify-between border-b border-[var(--color-outline-variant)] px-6 py-5">
              <h3 className="text-headline-md text-[24px] leading-tight text-[#1A1A1A]">
                Notificaciones
              </h3>
              <button
                type="button"
                onClick={markAllRead}
                className="text-label-sm text-[#8A8275] transition-all hover:text-[#1A1A1A] hover:underline"
              >
                Marcar todas como leídas
              </button>
            </div>

            {/* Notification list */}
            <ul
              className="max-h-[480px] overflow-y-auto"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d0c5b4 transparent' }}
              role="list"
            >
              {items.length === 0 ? (
                <li className="px-6 py-12 text-center">
                  <Bell size={32} strokeWidth={1.4} className="mx-auto mb-3 text-[var(--color-outline)]" />
                  <p className="text-body-md text-[var(--color-on-surface-variant)]">Sin notificaciones</p>
                </li>
              ) : (
                items.map((notif) => (
                  <NotificacionItem
                    key={notif.id}
                    notif={notif}
                    onRead={() =>
                      setItems((prev) =>
                        prev.map((n) => (n.id === notif.id ? { ...n, leida: true } : n)),
                      )
                    }
                  />
                ))
              )}
            </ul>

            {/* Panel footer */}
            <div className="flex justify-center border-t border-[var(--color-outline-variant)] bg-white p-4">
              <button
                type="button"
                className="text-label-sm flex items-center gap-2 uppercase tracking-widest text-[#8A8275] transition-colors hover:text-[#1A1A1A]"
              >
                Cargar más
                <ChevronDown size={16} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* CSS keyframe for panel entry animation */}
      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Notification item row
// ---------------------------------------------------------------------------

function NotificacionItem({
  notif,
  onRead,
}: {
  notif: Notificacion
  onRead: () => void
}) {
  return (
    <li
      role="listitem"
      onClick={onRead}
      className={`flex cursor-pointer gap-4 border-b border-[var(--color-outline-variant)] px-6 py-5 transition-colors hover:bg-[var(--color-surface-bright)] ${notif.leida ? 'opacity-80' : 'bg-[var(--color-surface-container-lowest)]/50'}`}
    >
      <NotificacionIcono tipo={notif.tipo} />

      <div className="min-w-0 flex-grow">
        <div className="mb-1 flex items-start justify-between gap-2">
          <span className="text-label-md font-semibold leading-snug text-[#1A1A1A]">
            {notif.titulo}
          </span>
          <span className="text-label-sm flex-shrink-0 text-[#8A8275]">{notif.tiempo}</span>
        </div>
        <p className="text-body-md text-[14px] leading-snug text-[#8A8275]">
          {notif.descripcion}
        </p>
      </div>

      {/* Unread indicator */}
      <div className="flex flex-shrink-0 items-center self-center">
        {!notif.leida ? (
          <span
            aria-label="No leída"
            className="size-2 rounded-full bg-[#7A2E3A]"
          />
        ) : (
          <span className="size-2" />
        )}
      </div>
    </li>
  )
}
