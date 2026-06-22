import { Download, Star, Truck, X } from 'lucide-react'
import type { ConsumerOrder, ConsumerOrderProduct } from '../pages/HistorialPedidosPage'

type OrderDetailModalProps = {
  order: ConsumerOrder
  onClose: () => void
  onReview: (product: ConsumerOrderProduct) => void
}

type ProductReviewModalProps = {
  product: ConsumerOrderProduct
  onClose: () => void
}

export function OrderDetailModal({ order, onClose, onReview }: OrderDetailModalProps) {
  const canReviewProducts =
    order.status === 'ENTREGADO' &&
    order.deliveryMethod.toLowerCase().includes('mensajer')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1A1A1A]/60 p-4 backdrop-blur-sm sm:p-[var(--space-margin-mobile)] md:p-[var(--space-margin-desktop)]" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
      <div className="relative flex max-h-full w-full max-w-3xl flex-col border border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] bg-[#FAF7F0] shadow-2xl">
        <button type="button" aria-label="Cerrar modal" onClick={onClose} className="absolute top-6 right-6 z-10 bg-[#FAF7F0]/80 p-2 text-[var(--color-on-surface-variant)] backdrop-blur-md transition-colors hover:text-[var(--color-primary)]">
          <X size={20} strokeWidth={1.8} />
        </button>

        <div className="overflow-y-auto p-8 sm:p-12">
          <header className="mb-10 text-center sm:text-left">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-display-lg text-[48px] tracking-tight text-[#1A1A1A]" id="order-detail-title">
                {order.id}
              </h2>
              <span className="text-label-md inline-flex items-center self-center border border-[var(--color-secondary)] bg-[color-mix(in_srgb,var(--color-secondary)_5%,transparent)] px-3 py-1 uppercase tracking-wider text-[var(--color-secondary)] sm:self-auto">
                {order.status === 'ENTREGADO' ? 'Entregado' : 'Pendiente'}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-body-lg text-[var(--color-on-surface-variant)]">
                Productor: <a className="border-b border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] font-medium text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary-container)]" href="#">{order.producer}</a>
              </p>
              <p className="text-label-sm text-[var(--color-outline)]">Parte de tu compra del {order.date} | {order.location}</p>
            </div>
          </header>

          <section className="mb-12 border-t border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] py-6">
            <h3 className="sr-only">Productos en este pedido</h3>
            {order.products.map((product, index) => (
              <div key={product.name} className={`flex flex-col items-start gap-6 py-4 sm:flex-row sm:items-center ${index > 0 ? 'border-t border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)]' : ''}`}>
                <div className="size-24 shrink-0 border border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)] bg-[var(--color-surface-container-low)] p-1">
                  <img src={product.image} alt={product.name} className="size-full object-cover grayscale-[20%] mix-blend-multiply" />
                </div>
                <div className="w-full flex-1 space-y-1">
                  <h4 className="text-headline-md text-[24px] leading-8 text-[#1A1A1A]">{product.name}</h4>
                  <p className="text-label-sm text-[var(--color-on-surface-variant)]">{product.detail}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-label-md text-[var(--color-outline)]">{product.quantity}</span>
                    <span className="text-body-md text-[#1A1A1A]">{product.unitPrice}</span>
                  </div>
                </div>
                <div className="mt-4 flex w-full flex-row items-center justify-between gap-2 sm:mt-0 sm:w-auto sm:flex-col sm:items-end">
                  <span className="text-body-lg font-medium text-[#1A1A1A]">{product.total}</span>
                  <button type="button" onClick={() => onReview(product)} className="text-label-sm flex items-center gap-1 text-[var(--color-primary)] hover:underline">
                    <Star size={14} strokeWidth={1.8} />
                    Valorar
                  </button>
                </div>
              </div>
            ))}
          </section>

          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            <section className="border border-[color-mix(in_srgb,var(--color-outline)_10%,transparent)] bg-[var(--color-surface)] p-6">
              <h3 className="text-label-md mb-4 flex items-center gap-2 uppercase tracking-widest text-[var(--color-outline)]">
                <Truck size={16} strokeWidth={1.8} />
                Información de Entrega
              </h3>
              <div className="space-y-4">
                <DetailField label="Método" value={order.deliveryMethod} />
                <DetailField label="Dirección de Entrega" value={order.deliveryAddress} preserveLineBreaks />
                <DetailField label="Seguimiento" value={order.tracking} mono />
              </div>
            </section>

            <section className="flex flex-col justify-end">
              <div className="text-body-md space-y-3 text-[var(--color-on-surface-variant)]">
                <div className="flex justify-between">
                  <span>Subtotal Productos</span>
                  <span>{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gastos de Envío</span>
                  <span>{order.shipping}</span>
                </div>
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-[#1A1A1A] pt-6">
                <span className="text-label-md uppercase tracking-widest text-[#1A1A1A]">Total</span>
                <span className="text-headline-md text-[32px] text-[#1A1A1A]">{order.total}</span>
              </div>
              <p className="text-label-sm mt-2 text-right text-[var(--color-outline)]">IVA incluido</p>
            </section>
          </div>

          <footer className="flex flex-col items-center justify-between gap-6 border-t border-[color-mix(in_srgb,var(--color-outline)_20%,transparent)] pt-8 sm:flex-row-reverse">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {canReviewProducts ? (
                <button
                  type="button"
                  onClick={() => onReview(order.products[0])}
                  className="text-label-md flex w-full items-center justify-center gap-2 border border-[#7A2E3A] px-8 py-4 uppercase tracking-wider text-[#7A2E3A] transition-colors duration-200 hover:bg-[#7A2E3A] hover:text-white sm:w-auto"
                >
                  <Star size={16} strokeWidth={1.8} />
                  Valorar producto
                </button>
              ) : null}
              <button type="button" className="text-label-md w-full bg-[#7A2E3A] px-8 py-4 uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#63222d] sm:w-auto">
                Ver Seguimiento
              </button>
            </div>
            <div className="flex w-full items-center justify-center gap-6 sm:w-auto sm:justify-start">
              <a href="#" className="text-label-sm text-[var(--color-on-surface-variant)] transition-colors hover:text-[#1A1A1A] hover:underline">Reportar incidencia</a>
              <span className="h-4 w-px bg-[color-mix(in_srgb,var(--color-outline)_30%,transparent)]" />
              <a href="#" className="text-label-sm flex items-center gap-1 text-[var(--color-on-surface-variant)] transition-colors hover:text-[#1A1A1A]">
                <Download size={16} strokeWidth={1.8} />
                Comprobante
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export function ProductReviewModal({ product, onClose }: ProductReviewModalProps) {
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

          <form className="flex flex-col gap-8" onSubmit={(event) => event.preventDefault()}>
            <div className="flex flex-col gap-3 border-t border-[var(--color-outline-variant)] pt-6">
              <label className="text-label-md uppercase text-[#1A1A1A]">Puntuación</label>
              <div className="flex w-fit gap-1" aria-label="Puntuación de 5 estrellas">
                {Array.from({ length: 5 }, (_, index) => (
                  <button key={index} type="button" aria-label={`${index + 1} estrellas`} className="text-[var(--color-outline-variant)] transition-colors hover:text-[#7A2E3A] focus:text-[#7A2E3A] focus:outline-none">
                    <Star size={32} strokeWidth={1.5} />
                  </button>
                ))}
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
              <button type="reset" className="text-label-md border border-transparent bg-transparent px-6 py-4 uppercase tracking-wider text-[var(--color-on-surface-variant)] transition-all duration-300 hover:border-[var(--color-outline-variant)]">
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
