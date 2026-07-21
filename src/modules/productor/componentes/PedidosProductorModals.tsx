import { Check, CircleAlert, Info, Loader2, MapPin, Truck, X } from 'lucide-react'
import { formatMoney } from '../../../lib/formatMoney'
import type { SubOrderListItemDTO, SubOrderStatus } from '../pedidos/pedidos.schema'

// ---------------------------------------------------------------------------
// Status display helpers
// ---------------------------------------------------------------------------

type DisplayStatus = 'Pendiente' | 'En preparación' | 'Enviado' | 'Entregado' | 'Cancelado'

const STATUS_DISPLAY_MAP: Record<SubOrderStatus, DisplayStatus> = {
  pending: 'Pendiente',
  preparing: 'En preparación',
  sent: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

// ---------------------------------------------------------------------------
// Status stepper
// ---------------------------------------------------------------------------

const STEPS: SubOrderStatus[] = ['pending', 'preparing', 'sent', 'delivered']

function stepIndex(status: SubOrderStatus): number {
  const idx = STEPS.indexOf(status)
  return idx === -1 ? -1 : idx // -1 = Cancelado
}

function StatusStepper({ status }: { status: SubOrderStatus }) {
  const active = stepIndex(status)

  return (
    <section aria-label="Estado del pedido">
      <div className="flex items-start justify-between">
        {STEPS.map((step, i) => {
          const isDone = active > i
          const isCurrent = active === i
          const isActive = isDone || isCurrent
          const displayStep = STATUS_DISPLAY_MAP[step]

          return (
            <div key={step} className="flex flex-1 items-start">
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex size-7 items-center justify-center rounded-full border-2 text-[11px] transition-all ${isActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-inner' : 'border-[var(--color-outline-variant)] text-[var(--color-secondary)]'}`}
                >
                  {isActive ? <Check size={13} strokeWidth={2.5} /> : null}
                </div>
                <span
                  className={`mt-2 text-[10px] font-bold uppercase tracking-[0.08em] ${isCurrent || isDone ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'}`}
                >
                  {displayStep}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mt-3 h-0.5 flex-1 transition-colors ${isDone ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-outline-variant)]'}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// CTA label helper — maps current status to the advance action label
// ---------------------------------------------------------------------------

function ctaLabel(status: SubOrderStatus): string {
  switch (status) {
    case 'pending': return 'Marcar en preparación'
    case 'preparing': return 'Marcar como enviado'
    case 'sent': return 'Marcar como entregado'
    default: return ''
  }
}

// ---------------------------------------------------------------------------
// DetallePedidoModal
// ---------------------------------------------------------------------------

type DetallePedidoModalProps = {
  pedido: SubOrderListItemDTO
  isPending: boolean
  onClose: () => void
  onCancel: () => void
  onAdvanceStatus: () => void
}

export function DetallePedidoModal({
  pedido,
  isPending,
  onClose,
  onCancel,
  onAdvanceStatus,
}: DetallePedidoModalProps) {
  // Tracking block: only when courier + sent (trackingNumber always null in Cycle 2)
  const showTracking =
    pedido.status === 'sent' &&
    pedido.deliveryType === 'SHIPPING_FLAT_RATE'

  const cta = ctaLabel(pedido.status)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-on-surface)]/30 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detalle-pedido-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-[var(--color-outline-variant)] bg-[#FAF7F0] shadow-2xl">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[var(--color-outline-variant)] bg-white/50 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <h2
              className="text-headline-md text-[24px] text-[var(--color-on-surface)]"
              id="detalle-pedido-title"
            >
              Pedido #{pedido.id.slice(0, 8)}
            </h2>
            <StatusBadge status={pedido.status} />
          </div>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="p-2 text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)]"
          >
            <X size={22} strokeWidth={1.8} />
          </button>
        </header>

        {/* Body (scrollable) */}
        <div className="flex-1 space-y-8 overflow-y-auto p-5 md:space-y-10 md:p-8">
          <StatusStepper status={pedido.status} />

          {/* Info grid */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[var(--space-gutter)]">
            {/* Cliente */}
            {pedido.consumerName || pedido.consumerEmail ? (
              <div className="space-y-4">
                <SectionTitle>Cliente</SectionTitle>
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex size-12 items-center justify-center rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-highest)] text-[var(--color-secondary)]">
                    <span className="text-label-md text-sm">
                      {pedido.consumerName
                        ? pedido.consumerName
                            .split(' ')
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                        : '?'}
                    </span>
                  </div>
                  <div>
                    {pedido.consumerName ? (
                      <p className="text-headline-md text-lg leading-tight">{pedido.consumerName}</p>
                    ) : null}
                    {pedido.consumerEmail ? (
                      <p className="text-sm text-[var(--color-secondary)]">{pedido.consumerEmail}</p>
                    ) : null}
                    {pedido.consumerPhone ? (
                      <p className="text-sm text-[var(--color-secondary)]">{pedido.consumerPhone}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Envío */}
            {pedido.deliveryType ? (
              <div className="space-y-4">
                <SectionTitle>Envío</SectionTitle>
                <div className="flex items-start gap-3 pt-1">
                  {pedido.deliveryType === 'SHIPPING_FLAT_RATE' ? (
                    <Truck size={20} strokeWidth={1.8} className="mt-0.5 text-[var(--color-secondary)]" />
                  ) : (
                    <MapPin size={20} strokeWidth={1.8} className="mt-0.5 text-[var(--color-secondary)]" />
                  )}
                  <div>
                    <p className="text-label-md text-[var(--color-on-surface)]">
                      {pedido.deliveryType === 'SHIPPING_FLAT_RATE' ? 'Mensajería' : 'Punto de recogida'}
                    </p>
                    {pedido.deliveryAddress ? (
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-secondary)]">
                        {pedido.deliveryAddress}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {/* Product table */}
          <section className="space-y-4">
            <SectionTitle>Resumen de Productos</SectionTitle>
            <div className="overflow-hidden border border-[var(--color-outline-variant)] bg-white/30">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--color-surface-container-low)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">
                  <tr>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3 text-center">Cant.</th>
                    <th className="px-4 py-3 text-right">Precio Un.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]">
                  {pedido.orderLines.map((line) => (
                    <tr
                      key={line.id}
                      className="transition-colors hover:bg-[var(--color-surface-container-lowest)]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {line.productImageUrl ? (
                            <div
                              className="size-10 flex-shrink-0 rounded-sm bg-cover bg-center bg-[var(--color-surface-container-high)]"
                              style={{ backgroundImage: `url('${line.productImageUrl}')` }}
                            />
                          ) : (
                            <div className="size-10 flex-shrink-0 rounded-sm bg-[var(--color-surface-container-high)]" />
                          )}
                          <span className="font-medium text-[var(--color-on-surface)]">
                            {line.productName ?? `Producto ${line.productId.slice(0, 8)}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">{line.quantity}</td>
                      {/* money-typing R2-R4: display backend decimal string via formatMoney */}
                      <td className="px-4 py-4 text-right">{formatMoney(line.unitPriceSnapshot)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Totals — only backend-provided money values shown */}
          <section className="flex justify-end">
            <div className="w-full max-w-64 space-y-3">
              <div className="flex justify-between text-sm text-[var(--color-secondary)]">
                <span>Gastos de envío</span>
                {/* money-typing R2-R4: shippingCostSnapshot is Decimal string from backend */}
                <span>{formatMoney(pedido.shippingCostSnapshot)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[var(--color-outline)] pt-3">
                <span className="font-bold text-[var(--color-on-surface)]">Total de líneas</span>
                {/*
                  money-typing R2: client MUST NOT compute totals by summing unit prices.
                  The backend does not return a per-SubOrder total in Cycle 2; show '—' until
                  the backend projects a computed total field.
                */}
                <span className="text-headline-md text-2xl font-bold text-[var(--color-primary)]">—</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-6 border-t border-[var(--color-outline-variant)] bg-white px-8 py-6">
          {/* Tracking number — always null in Cycle 2 (spec: trackingNumber deferred) */}
          {showTracking ? (
            <div className="w-full space-y-4 rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-6">
              <div className="flex items-center gap-2">
                <Info size={18} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                <h4 className="text-label-md font-bold text-[var(--color-on-surface)]">Número de seguimiento</h4>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-secondary)]">
                <CircleAlert size={16} strokeWidth={1.8} className="text-[var(--color-primary)]" />
                <p className="text-sm italic">
                  Pendiente de anexar — el cliente aún no puede seguir el envío.
                </p>
              </div>
              {/* Tracking number entry is deferred (RF-21 / Cycle 3) — field exists but is not settable via API in Cycle 2 */}
              <p className="text-label-sm text-[var(--color-outline)]">
                La funcionalidad de número de seguimiento se activará en una próxima versión.
              </p>
            </div>
          ) : null}

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {pedido.status !== 'cancelled' && pedido.status !== 'delivered' ? (
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="text-label-md text-left text-sm text-[var(--color-error)] transition-all hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar pedido
              </button>
            ) : (
              <span />
            )}

            {cta ? (
              <button
                type="button"
                onClick={onAdvanceStatus}
                disabled={isPending}
                className="text-label-md inline-flex items-center gap-2 rounded-[var(--radius-default)] bg-[#7A2E3A] px-10 py-4 text-white shadow-lg transition-all duration-150 hover:bg-[var(--color-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : null}
                {cta}
              </button>
            ) : null}
          </div>

          <p className="flex items-center gap-2 text-xs text-[var(--color-secondary)]">
            <Info size={14} strokeWidth={1.8} />
            El cliente recibirá una notificación automática al cambiar el estado.
          </p>
        </footer>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CancelarPedidoModal
// ---------------------------------------------------------------------------

type CancelarPedidoModalProps = {
  pedido: SubOrderListItemDTO
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
}

export function CancelarPedidoModal({ pedido, isPending, onClose, onConfirm }: CancelarPedidoModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--color-on-surface)]/40 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cancelar-pedido-title"
    >
      <div className="relative w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-outline-variant)] bg-[var(--color-background)] p-10 shadow-2xl">
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-6 right-6 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={22} strokeWidth={1.8} />
        </button>

        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-[var(--color-error-container)] text-[var(--color-error)]">
            <CircleAlert size={32} strokeWidth={1.6} />
          </div>
          <h2
            className="text-headline-md mb-4 text-[var(--color-primary)]"
            id="cancelar-pedido-title"
          >
            Cancelar pedido
          </h2>
          <p className="text-body-lg mb-4 text-[var(--color-on-surface-variant)]">
            ¿Seguro que deseas cancelar este pedido? Esta acción no se puede deshacer.
          </p>
          <p className="text-label-md mb-4 text-[var(--color-primary)]">
            Pedido #{pedido.id.slice(0, 8)}
          </p>
          <div className="rounded-[var(--radius-default)] border-l-4 border-[var(--color-primary)] bg-[var(--color-surface-container)] p-4 text-left">
            <p className="text-body-md text-sm italic text-[var(--color-on-surface-variant)]">
              El pago ya fue procesado; deberás gestionar la devolución conforme a la política de la plataforma.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="text-label-md inline-flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] py-4 uppercase tracking-widest text-white transition-all hover:bg-[var(--color-primary-container)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : null}
            Sí, cancelar pedido
          </button>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            disabled={isPending}
            className="text-label-md w-full border border-[var(--color-outline)] py-4 uppercase tracking-widest text-[var(--color-on-surface)] transition-all hover:bg-[var(--color-surface-container-high)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Volver
          </button>
        </div>

        <div className="mt-8 flex justify-center border-t border-[var(--color-outline-variant)] pt-8">
          <div className="flex items-center gap-2">
            <Check size={14} strokeWidth={2} className="text-[var(--color-secondary)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
              Origin: D.O. Alicante
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-label-md border-b border-[var(--color-outline-variant)] pb-2 text-[11px] uppercase tracking-widest text-[var(--color-secondary)]">
      {children}
    </h3>
  )
}

function StatusBadge({ status }: { status: SubOrderStatus }) {
  const displayStatus = STATUS_DISPLAY_MAP[status]

  const classMap: Record<SubOrderStatus, string> = {
    pending: 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]',
    preparing: 'bg-[var(--color-surface-container-highest)] text-[var(--color-secondary)]',
    sent: 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]',
    delivered: 'bg-[#006a4e] text-white',
    cancelled: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
  }

  return (
    <span className={`rounded-sm px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] ${classMap[status]}`}>
      {displayStatus}
    </span>
  )
}
