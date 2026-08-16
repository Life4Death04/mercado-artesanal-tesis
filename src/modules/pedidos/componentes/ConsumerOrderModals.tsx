import { Flag, Truck, X } from 'lucide-react'
import type { ConsumerOrder, ConsumerOrderStatus, ConsumerSubOrder } from '../pages/HistorialPedidosPage'

type OrderDetailModalProps = {
  order: ConsumerOrder
  onClose: () => void
  onReport: (subOrder: ConsumerSubOrder) => void
  onCancel?: () => void
  isCancelling: boolean
  cancelError: string | null
}

const statusSteps: ConsumerOrderStatus[] = ['Pendiente', 'Confirmado', 'En preparación', 'En camino', 'Entregado']

export function OrderDetailModal({ order, onClose, onReport, onCancel, isCancelling, cancelError }: OrderDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1A1A1A]/60 p-4 backdrop-blur-sm sm:p-[var(--space-margin-mobile)] md:p-[var(--space-margin-desktop)]" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
      <div className="relative flex max-h-full w-full max-w-5xl flex-col border border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] bg-[#FAF7F0] shadow-2xl">
        <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute top-6 right-6 z-10 bg-[#FAF7F0]/80 p-2 text-[var(--color-on-surface-variant)] backdrop-blur-md transition-colors hover:text-[var(--color-primary)]">
          <X size={20} strokeWidth={1.8} />
        </button>

        <div className="overflow-y-auto p-6 sm:p-10">
          <header className="mb-8 pr-12">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-display-lg text-[48px] tracking-tight text-[#1A1A1A]" id="order-detail-title">
                {order.id}
              </h2>
              <StatusPill status={order.status} />
            </div>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">
              Compra del {order.date} · {order.subOrders.length} entrega{order.subOrders.length === 1 ? '' : 's'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2"><p className="text-headline-md text-[28px] text-[#7A2E3A]">Total: {order.total}</p>{order.paymentStatus ? <p className="text-label-sm uppercase tracking-wider text-[var(--color-outline)]">Pago: {order.paymentStatus}</p> : null}</div>
          </header>

          <div className="grid gap-5">
            {order.subOrders.map((subOrder) => (
              <SubOrderPanel key={subOrder.id} subOrder={subOrder} onReport={onReport} />
            ))}
          </div>

           <footer className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] pt-8 sm:flex-row-reverse">
            <button type="button" onClick={onClose} className="text-label-md w-full bg-[#7A2E3A] px-8 py-4 uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#63222d] sm:w-auto">
              Volver
             </button>
             {onCancel ? <div className="w-full sm:mr-auto sm:w-auto"><button type="button" disabled={isCancelling} onClick={onCancel} className="text-label-md border border-[var(--color-error)] px-5 py-3 uppercase tracking-wider text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-60">{isCancelling ? 'Cancelando...' : 'Cancelar pedido'}</button>{cancelError ? <p role="alert" className="text-label-sm mt-2 text-[var(--color-error)]">{cancelError}</p> : null}</div> : null}
          </footer>
        </div>
      </div>
    </div>
  )
}

function SubOrderPanel({ subOrder, onReport }: { subOrder: ConsumerSubOrder; onReport: (subOrder: ConsumerSubOrder) => void }) {
  return (
    <section className="border border-[color-mix(in_srgb,var(--color-outline)_14%,transparent)] bg-[var(--color-surface)] p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3 className="text-headline-md text-[26px] text-[#1A1A1A]">{subOrder.producer}</h3>
            <StatusPill status={subOrder.status} />
          </div>
           <p className="text-label-sm text-[var(--color-outline)]">{subOrder.id}</p>
         </div>
        {subOrder.total ? <div className="text-left lg:text-right">
           <p className="text-label-sm uppercase tracking-wider text-[var(--color-outline)]">Total subpedido</p>
           <p className="text-headline-md text-[28px] text-[#7A2E3A]">{subOrder.total}</p>
        </div> : null}
      </div>

      <StatusTimeline status={subOrder.status} />

      <div className="mt-7 border-t border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)] pt-4">
        {subOrder.products.map((product, index) => (
          <div key={`${subOrder.id}-${index}`} className={`flex flex-col items-start gap-5 py-4 sm:flex-row sm:items-center ${index > 0 ? 'border-t border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)]' : ''}`}>
            {product.image ? <div className="size-24 shrink-0 border border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)] bg-[var(--color-surface-container-low)] p-1">
              <img src={product.image} alt={product.name} className="size-full object-cover grayscale-[15%] mix-blend-multiply" />
            </div> : null}
            <div className="w-full flex-1 space-y-1">
              <h4 className="text-headline-md text-[22px] leading-7 text-[#1A1A1A]">{product.name || `Línea ${index + 1}`}</h4>
              {product.detail ? <p className="text-label-sm text-[var(--color-on-surface-variant)]">{product.detail}</p> : null}
              <div className="mt-2 flex items-center gap-4">
                <span className="text-label-md text-[var(--color-outline)]">Cantidad: {product.quantity}</span>
                <span className="text-body-md text-[#1A1A1A]">Precio unitario: {product.unitPrice}</span>
              </div>
            </div>
            {product.total ? <span className="text-body-lg font-medium text-[#1A1A1A]">{product.total}</span> : null}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 border-t border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)] pt-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-4 sm:grid-cols-3">
          <DetailField label="Método" value={subOrder.deliveryMethod} />
          <TrackingField value={subOrder.tracking || null} />
          {subOrder.deliveryAddress ? <DetailField label="Dirección" value={subOrder.deliveryAddress} preserveLineBreaks /> : null}
        </div>
        <div className="flex max-w-xs flex-col gap-2 md:items-end">
          <button
            type="button"
            disabled={!subOrder.canReportIncident}
            onClick={() => onReport(subOrder)}
            title={subOrder.reportIncidentUnavailableReason ?? 'Reportar una incidencia sobre esta entrega'}
            className="text-label-md inline-flex items-center justify-center gap-2 border border-[#7A2E3A] px-5 py-3 uppercase tracking-wider text-[#7A2E3A] transition-colors hover:bg-[#7A2E3A] hover:text-white disabled:cursor-not-allowed disabled:border-[var(--color-outline-variant)] disabled:text-[var(--color-outline)] disabled:hover:bg-transparent"
          >
            <Flag size={16} strokeWidth={1.8} />
            Reportar
          </button>
          {subOrder.reportIncidentUnavailableReason ? <p className="text-label-sm text-[var(--color-outline)] md:text-right">{subOrder.reportIncidentUnavailableReason}</p> : null}
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-5 text-body-md text-[var(--color-on-surface-variant)]">
        {subOrder.subtotal ? <span>Subtotal: {subOrder.subtotal}</span> : null}
        <span>Envío: {subOrder.shipping}</span>
      </div>
    </section>
  )
}

function StatusTimeline({ status }: { status: ConsumerOrderStatus }) {
  const activeIndex = status === 'Cancelado' ? -1 : statusSteps.indexOf(status)

  if (status === 'Cancelado') {
    return <p className="border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-4 py-3 text-body-md text-[var(--color-on-surface-variant)]">Este subpedido fue cancelado antes de entrar en preparación.</p>
  }

  return (
    <ol className="grid gap-3 sm:grid-cols-5" aria-label="Seguimiento del subpedido">
      {statusSteps.map((step, index) => {
        const active = index <= activeIndex
        return (
          <li key={step} className="flex items-center gap-2 sm:block">
            <span className={`mb-2 flex size-8 items-center justify-center rounded-full border text-xs font-semibold ${active ? 'border-[#7A2E3A] bg-[#7A2E3A] text-white' : 'border-[var(--color-outline-variant)] text-[var(--color-outline)]'}`}>
              {index + 1}
            </span>
            <span className={`text-label-sm ${active ? 'text-[#1A1A1A]' : 'text-[var(--color-outline)]'}`}>{step}</span>
          </li>
        )
      })}
    </ol>
  )
}

function StatusPill({ status }: { status: ConsumerOrderStatus }) {
  return (
    <span className="text-label-sm inline-flex items-center self-start rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-3 py-1 uppercase tracking-wider text-[var(--color-secondary)]">
      <Truck size={14} strokeWidth={1.8} className="mr-1.5" />
      {status}
    </span>
  )
}

function DetailField({ label, value, preserveLineBreaks = false, mono = false }: { label: string; value: string; preserveLineBreaks?: boolean; mono?: boolean }) {
  return (
    <div>
      <p className="text-label-sm mb-1 text-[var(--color-on-surface-variant)]">{label}</p>
      <p className={`text-body-md text-[#1A1A1A] ${preserveLineBreaks ? 'whitespace-pre-line leading-relaxed' : ''} ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}

function TrackingField({ value }: { value: string | null }) {
  return (
    <div className="border border-[color-mix(in_srgb,#7A2E3A_28%,transparent)] bg-[color-mix(in_srgb,#7A2E3A_8%,white)] p-4">
      <p className="text-label-sm mb-1 text-[var(--color-on-surface-variant)]">Seguimiento</p>
      <p className={`text-body-md text-[#1A1A1A] ${value ? 'font-mono' : ''}`}>{value ?? 'Aún no disponible'}</p>
    </div>
  )
}
