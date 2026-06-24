import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Flag, Star, Truck, X } from 'lucide-react'
import type { ConsumerOrder, ConsumerOrderProduct, ConsumerOrderStatus, ConsumerSubOrder } from '../pages/HistorialPedidosPage'

type OrderDetailModalProps = {
  order: ConsumerOrder
  onClose: () => void
  onReview: (product: ConsumerOrderProduct) => void
}

type ProductReviewModalProps = {
  product: ConsumerOrderProduct
  onClose: () => void
}

const statusSteps: ConsumerOrderStatus[] = ['Pendiente', 'Confirmado', 'En preparación', 'En camino', 'Entregado']

export function OrderDetailModal({ order, onClose, onReview }: OrderDetailModalProps) {
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
              Compra del {order.date} · {order.subOrders.length} envío{order.subOrders.length === 1 ? '' : 's'} · {order.address}
            </p>
          </header>

          <div className="grid gap-5">
            {order.subOrders.map((subOrder) => (
              <SubOrderPanel key={subOrder.id} subOrder={subOrder} onReview={onReview} />
            ))}
          </div>

          <footer className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] pt-8 sm:flex-row-reverse">
            <button type="button" onClick={onClose} className="text-label-md w-full bg-[#7A2E3A] px-8 py-4 uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#63222d] sm:w-auto">
              Volver
            </button>
            <a href="#" className="text-label-sm flex items-center gap-1 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#1A1A1A]">
              <Download size={16} strokeWidth={1.8} />
              Descargar comprobante
            </a>
          </footer>
        </div>
      </div>
    </div>
  )
}

function SubOrderPanel({ subOrder, onReview }: { subOrder: ConsumerSubOrder; onReview: (product: ConsumerOrderProduct) => void }) {
  return (
    <section className="border border-[color-mix(in_srgb,var(--color-outline)_14%,transparent)] bg-[var(--color-surface)] p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3 className="text-headline-md text-[26px] text-[#1A1A1A]">{subOrder.producer}</h3>
            <StatusPill status={subOrder.status} />
          </div>
          <p className="text-label-sm text-[var(--color-outline)]">{subOrder.id} · {subOrder.location}</p>
        </div>
        <div className="text-left lg:text-right">
          <p className="text-label-sm uppercase tracking-wider text-[var(--color-outline)]">Total subpedido</p>
          <p className="text-headline-md text-[28px] text-[#7A2E3A]">{subOrder.total}</p>
        </div>
      </div>

      <StatusTimeline status={subOrder.status} />

      <div className="mt-7 border-t border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)] pt-4">
        {subOrder.products.map((product, index) => (
          <div key={product.name} className={`flex flex-col items-start gap-5 py-4 sm:flex-row sm:items-center ${index > 0 ? 'border-t border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)]' : ''}`}>
            <div className="size-24 shrink-0 border border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)] bg-[var(--color-surface-container-low)] p-1">
              <img src={product.image} alt={product.name} className="size-full object-cover grayscale-[15%] mix-blend-multiply" />
            </div>
            <div className="w-full flex-1 space-y-1">
              <h4 className="text-headline-md text-[22px] leading-7 text-[#1A1A1A]">{product.name}</h4>
              <p className="text-label-sm text-[var(--color-on-surface-variant)]">{product.detail}</p>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-label-md text-[var(--color-outline)]">{product.quantity}</span>
                <span className="text-body-md text-[#1A1A1A]">{product.unitPrice}</span>
              </div>
            </div>
            <div className="mt-4 flex w-full flex-row items-center justify-between gap-2 sm:mt-0 sm:w-auto sm:flex-col sm:items-end">
              <span className="text-body-lg font-medium text-[#1A1A1A]">{product.total}</span>
              {subOrder.status === 'Entregado' ? (
                product.reviewed ? (
                  <span className="text-label-sm inline-flex items-center gap-1 text-green-700">
                    <Star size={14} strokeWidth={1.8} fill="currentColor" />
                    Valorado
                  </span>
                ) : (
                  <button type="button" onClick={() => onReview(product)} className="text-label-sm flex items-center gap-1 text-[var(--color-primary)] hover:underline">
                    <Star size={14} strokeWidth={1.8} />
                    Valorar
                  </button>
                )
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 border-t border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)] pt-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-4 sm:grid-cols-3">
          <DetailField label="Método" value={subOrder.deliveryMethod} />
          <DetailField label="Seguimiento" value={subOrder.tracking} mono />
          <DetailField label="Dirección" value={subOrder.deliveryAddress} preserveLineBreaks />
        </div>
        <Link
          to={`/incidencias?search=${encodeURIComponent(subOrder.incidentId ?? subOrder.id)}`}
          className="text-label-md inline-flex items-center justify-center gap-2 border border-[#7A2E3A] px-5 py-3 uppercase tracking-wider text-[#7A2E3A] transition-colors hover:bg-[#7A2E3A] hover:text-white"
        >
          <Flag size={16} strokeWidth={1.8} />
          Reportar
        </Link>
      </div>

      <div className="mt-5 flex justify-end gap-5 text-body-md text-[var(--color-on-surface-variant)]">
        <span>Subtotal: {subOrder.subtotal}</span>
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

export function ProductReviewModal({ product, onClose }: ProductReviewModalProps) {
  const [rating, setRating] = useState(0)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A1A1A]/40 p-4 backdrop-blur-[2px] sm:p-[var(--space-gutter)]" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <div className="relative flex w-full max-w-[520px] flex-col border border-[var(--color-outline-variant)] bg-[#FAF7F0] shadow-[0_12px_40px_rgba(26,26,26,0.1)]">
        <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#1A1A1A]">
          <X size={24} strokeWidth={1.8} />
        </button>

        <div className="flex flex-col gap-8 p-8 sm:p-10">
          <header className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="size-16 shrink-0 overflow-hidden border border-[var(--color-outline-variant)] bg-white">
                <img src={product.image} alt={product.name} className="size-full object-cover" />
              </div>
              <div className="pt-1">
                <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-on-surface-variant)]">Nueva valoración</p>
                <h2 className="text-headline-md text-[24px] leading-tight text-[#1A1A1A]" id="review-modal-title">{product.name}</h2>
              </div>
            </div>
          </header>

          <form className="flex flex-col gap-8" onSubmit={(event) => { event.preventDefault(); onClose() }}>
            <div className="flex flex-col gap-3 border-t border-[var(--color-outline-variant)] pt-6">
              <label className="text-label-md uppercase text-[#1A1A1A]">Puntuación</label>
              <div className="flex w-fit gap-1" aria-label="Puntuación de 5 estrellas">
                {Array.from({ length: 5 }, (_, index) => {
                  const selected = index < rating
                  return (
                    <button key={index} type="button" onClick={() => setRating(index + 1)} aria-label={`${index + 1} estrellas`} className={`${selected ? 'text-[#7A2E3A]' : 'text-[var(--color-outline-variant)]'} transition-colors hover:text-[#7A2E3A] focus:text-[#7A2E3A] focus:outline-none`}>
                      <Star size={32} strokeWidth={1.5} fill={selected ? 'currentColor' : 'none'} />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-label-md uppercase text-[#1A1A1A]" htmlFor="review-comment">Tu comentario (opcional)</label>
              <textarea id="review-comment" name="comment" rows={4} placeholder="Comparte tu experiencia con este producto..." className="text-body-md w-full resize-none border border-[var(--color-outline-variant)] bg-transparent p-4 text-[#1A1A1A] placeholder:text-[var(--color-outline-variant)] transition-colors focus:border-[#7A2E3A] focus:ring-0 focus:outline-none" />
            </div>

            <div className="mt-2 flex items-center gap-4 border-t border-[var(--color-outline-variant)] pt-8">
              <button type="submit" className="text-label-md flex-1 bg-[#7A2E3A] px-6 py-4 uppercase tracking-wider text-[#FAF7F0] transition-colors duration-300 hover:bg-[#1A1A1A]">
                Valorar
              </button>
              <button type="reset" onClick={() => setRating(0)} className="text-label-md border border-transparent bg-transparent px-6 py-4 uppercase tracking-wider text-[var(--color-on-surface-variant)] transition-all duration-300 hover:border-[var(--color-outline-variant)]">
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
