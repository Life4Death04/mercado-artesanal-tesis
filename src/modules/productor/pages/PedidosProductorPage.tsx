import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Filter, Loader2, MapPin, Search, SlidersHorizontal, Truck, Warehouse } from 'lucide-react'
import { CancelarPedidoModal, DetallePedidoModal } from '../componentes/PedidosProductorModals'
import { usePedidosQuery } from '../pedidos/hooks/usePedidosQuery'
import { useUpdateSubOrderStatusMutation } from '../pedidos/hooks/useUpdateSubOrderStatusMutation'
import { useCancelSubOrderMutation } from '../pedidos/hooks/useCancelSubOrderMutation'
import { useProductosQuery } from '../productos/hooks/useProductosQuery'
import { resolveOrderProduct, type OrderProductCatalog } from '../pedidos/orderProductCatalog'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { formatMoneyFromCents } from '../../../lib/formatMoney'
import { getSubOrderTotalCents } from '../pedidos/pedidos.money'
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
// Pagination
// ---------------------------------------------------------------------------

const PAGE_SIZE = 4

// ---------------------------------------------------------------------------
// Next-status logic (mirrors spec state machine)
// ---------------------------------------------------------------------------

function getNextStatus(status: SubOrderStatus): SubOrderStatus | null {
  if (status === 'pending') return 'preparing'
  if (status === 'preparing') return 'sent'
  if (status === 'sent') return 'delivered'
  return null
}

// ---------------------------------------------------------------------------
// PedidosProductorPage
// ---------------------------------------------------------------------------

export function PedidosProductorPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SubOrderStatus | 'all'>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null)
  const [cancelingPedidoId, setCancelingPedidoId] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  // Data layer — hooks only (no direct .api.ts imports in pages: spec R5)
  const { data: pedidos = [], isLoading, isError, error } = usePedidosQuery()
  const {
    data: productos,
    isLoading: isCatalogLoading,
    isError: isCatalogError,
  } = useProductosQuery()
  const advanceMutation = useUpdateSubOrderStatusMutation()
  const cancelMutation = useCancelSubOrderMutation()
  const productCatalog: OrderProductCatalog = isCatalogLoading
    ? { status: 'loading' }
    : isCatalogError || productos === undefined
      ? { status: 'unavailable' }
      : { status: 'ready', products: productos }

  // ---------------------------------------------------------------------------
  // Filtering (client-side for snappiness; backend filtering available via hook
  // but client filter avoids an extra request on each status tab click)
  // ---------------------------------------------------------------------------

  const normalizedSearch = search.trim().toLowerCase()

  const searchFiltered = pedidos.filter((pedido) => {
    if (!normalizedSearch) return true

    const productSummary = pedido.orderLines
      .map((line) => resolveOrderProduct(line.productId, productCatalog).name)
      .filter(Boolean)
      .join(', ')

    return [
      pedido.id,
      pedido.consumerName ?? '',
      pedido.consumerEmail ?? '',
      STATUS_DISPLAY_MAP[pedido.status],
      pedido.deliveryType ?? '',
      productSummary,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  })

  const filtered = searchFiltered.filter((pedido) => {
    return statusFilter === 'all' || pedido.status === statusFilter
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectedPedido = selectedPedidoId
    ? pedidos.find((p) => p.id === selectedPedidoId) ?? null
    : null
  const cancelingPedido = cancelingPedidoId
    ? pedidos.find((p) => p.id === cancelingPedidoId) ?? null
    : null

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  function updateSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateStatus(filter: SubOrderStatus | 'all') {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  function handleAdvanceStatus(subOrderId: string, trackingNumber?: string) {
    const pedido = pedidos.find((p) => p.id === subOrderId)
    if (!pedido) return

    const nextStatus = getNextStatus(pedido.status)
    if (!nextStatus) return

    setMutationError(null)
    const requiresTracking =
      pedido.status === 'preparing' &&
      pedido.deliveryType === 'SHIPPING_FLAT_RATE'

    advanceMutation.mutate(
      {
        subOrderId,
        targetStatus: nextStatus,
        ...(requiresTracking && trackingNumber !== undefined ? { trackingNumber } : {}),
      },
      {
        onError: (err) => {
          setMutationError(resolveErrorMessage(err))
        },
        onSuccess: () => {
          // Close modal on success so the updated list is visible
          setSelectedPedidoId(null)
        },
      },
    )
  }

  function handleConfirmCancel() {
    if (!cancelingPedidoId) return

    setMutationError(null)
    cancelMutation.mutate(
      { subOrderId: cancelingPedidoId },
      {
        onError: (err) => {
          setMutationError(resolveErrorMessage(err))
          setCancelingPedidoId(null)
        },
        onSuccess: () => {
          setCancelingPedidoId(null)
          setSelectedPedidoId(null)
        },
      },
    )
  }

  // ---------------------------------------------------------------------------
  // Render: loading / error states
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <Loader2 size={36} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-6">
        <div className="max-w-md text-center">
          <p className="text-headline-md mb-4 text-[var(--color-primary)]">No se pudieron cargar los pedidos</p>
          <p className="text-body-md text-[var(--color-on-surface-variant)]">
            {resolveErrorMessage(error)}
          </p>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Status filter tabs (all + each SubOrderStatus)
  // ---------------------------------------------------------------------------

  const statusTabs: Array<{ key: SubOrderStatus | 'all'; label: string }> = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendiente' },
    { key: 'preparing', label: 'En preparación' },
    { key: 'sent', label: 'Enviado' },
    { key: 'delivered', label: 'Entregado' },
    { key: 'cancelled', label: 'Cancelado' },
  ]

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]">
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">
              Area Productor
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Mis pedidos</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">Mis pedidos</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Gestiona el avance de cada pedido, revisa los detalles del envio y filtra rapidamente por cliente, estado o producto.
              </p>
            </div>

            <div className="border border-[color-mix(in_srgb,var(--color-outline-variant)_40%,transparent)] bg-white/45 px-5 py-4 text-right shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)]">
              <span className="text-label-sm block uppercase tracking-[0.18em] text-[var(--color-outline)]">
                Pedidos filtrados
              </span>
              <strong className="text-headline-md text-[28px] text-[var(--color-primary)]">{filtered.length}</strong>
            </div>
          </div>
        </section>

        {mutationError ? (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 border border-[var(--color-error)] bg-[var(--color-error-container)] px-5 py-4 text-sm text-[var(--color-on-error-container)]"
          >
            {mutationError}
          </div>
        ) : null}

        <section
          className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6"
          aria-label="Filtros de pedidos del productor"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por pedido, cliente, correo o producto..."
                className="text-body-md w-full border border-[var(--color-outline-variant)] bg-[#FAF7F0] py-3 pl-11 pr-4 text-[#1A1A1A] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] focus:outline-none"
              />
            </label>

            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              aria-expanded={filtersOpen}
              className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 uppercase tracking-wider text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] lg:hidden"
            >
              <SlidersHorizontal size={18} strokeWidth={1.8} />
              Filtros
            </button>
          </div>

          <div
            className={`${filtersOpen ? 'mt-5 flex' : 'hidden'} min-w-0 flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-5 lg:mt-5 lg:flex lg:border-t lg:pt-5`}
          >
            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <Filter size={16} strokeWidth={1.8} />
              <span className="text-label-sm uppercase tracking-[0.18em]">Estado del pedido</span>
            </div>

            <div className="flex flex-wrap gap-3 pb-1">
              {statusTabs.map(({ key, label }) => {
                const count =
                  key === 'all'
                    ? searchFiltered.length
                    : searchFiltered.filter((p) => p.status === key).length

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateStatus(key)}
                    className={`text-label-md max-w-full whitespace-normal rounded-full border px-4 py-2 text-left transition-all sm:whitespace-nowrap ${statusFilter === key ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-outline-variant)] bg-transparent text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                  >
                    {label} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {visible.map((pedido) => (
            <OrderCard
              key={pedido.id}
              pedido={pedido}
              productCatalog={productCatalog}
              onView={() => setSelectedPedidoId(pedido.id)}
            />
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] p-10 text-center">
            <Filter className="mx-auto mb-3 text-[var(--color-outline)]" size={28} strokeWidth={1.8} />
            <p className="text-body-md text-[var(--color-on-surface-variant)]">
              No hay pedidos que coincidan con los filtros aplicados.
            </p>
          </div>
        ) : null}

        <section className="mt-12 flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-label-sm italic text-[var(--color-outline)]">
            Mostrando {visible.length} de {filtered.length} pedidos filtrados
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`text-label-md flex size-9 items-center justify-center rounded-full transition-colors ${page === safePage ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)]'}`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-surface-container-high)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
          </div>
        </section>
      </main>

      {selectedPedido && !cancelingPedido ? (
        <DetallePedidoModal
          pedido={selectedPedido}
          productCatalog={productCatalog}
          isPending={advanceMutation.isPending || cancelMutation.isPending}
          mutationError={mutationError}
          onClose={() => {
            setMutationError(null)
            setSelectedPedidoId(null)
          }}
          onCancel={() => setCancelingPedidoId(selectedPedido.id)}
          onAdvanceStatus={(trackingNumber) => handleAdvanceStatus(selectedPedido.id, trackingNumber)}
        />
      ) : null}

      {cancelingPedido ? (
        <CancelarPedidoModal
          pedido={cancelingPedido}
          isPending={cancelMutation.isPending}
          onClose={() => setCancelingPedidoId(null)}
          onConfirm={handleConfirmCancel}
        />
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// OrderCard sub-component
// ---------------------------------------------------------------------------

type OrderCardProps = {
  pedido: SubOrderListItemDTO
  productCatalog: OrderProductCatalog
  onView: () => void
}

function OrderCard({ pedido, productCatalog, onView }: OrderCardProps) {
  const isCancelled = pedido.status === 'cancelled'

  const productSummary = pedido.orderLines
    .map((line) => {
      const product = resolveOrderProduct(line.productId, productCatalog)
      return `${product.name} (${line.quantity})`
    })
    .join(', ')

  const displayTotal = formatMoneyFromCents(getSubOrderTotalCents(pedido))

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onView()
        }
      }}
      className={`cursor-pointer rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_10px_30px_-20px_rgba(122,46,58,0.25)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[0_20px_45px_-28px_rgba(122,46,58,0.35)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] md:p-7 ${isCancelled ? 'opacity-70' : ''}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-3">
              <span className="text-headline-md text-[var(--color-primary)]">#{pedido.id.slice(0, 8)}</span>
              <OrderStatusBadge status={pedido.status} />
            </div>
            <span className="text-label-sm text-[var(--color-secondary)]">
              {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pedido.consumerName ? (
              <OrderMeta label="Cliente" value={pedido.consumerName} />
            ) : null}

            {pedido.deliveryType ? (
              <div>
                <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">Entrega</p>
                <div className="flex items-center gap-2 text-[var(--color-on-surface)]">
                  {pedido.deliveryType === 'SHIPPING_FLAT_RATE' ? (
                    <Truck size={16} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                  ) : pedido.deliveryType === 'PERSONAL_DELIVERY' ? (
                    <MapPin size={16} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                  ) : (
                    <Warehouse size={16} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                  )}
                  <span className="text-body-md">
                    {pedido.deliveryType === 'SHIPPING_FLAT_RATE'
                      ? 'Mensajería'
                      : pedido.deliveryType === 'PERSONAL_DELIVERY'
                        ? 'Entrega personal'
                        : 'Punto de recogida'}
                  </span>
                </div>
              </div>
            ) : null}

            {productSummary ? (
              <div className="sm:col-span-2 xl:col-span-1">
                <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">Productos</p>
                <p className="text-body-md text-[var(--color-on-surface)]">{productSummary}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-row items-end justify-between gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-5 lg:min-w-[152px] lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
          <div className="text-right">
            <p className={`text-headline-md ${isCancelled ? 'text-[var(--color-secondary)] line-through' : 'text-[var(--color-primary)]'}`}>
              {displayTotal}
            </p>
            <p className="text-label-sm mt-1 text-[var(--color-outline)]">
              Total de este envío · {pedido.orderLines.length} línea{pedido.orderLines.length !== 1 ? 's' : ''}
            </p>
          </div>
          <span
            className={`text-label-md border-b pb-0 transition-all ${isCancelled ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]' : 'border-[var(--color-primary)] text-[var(--color-primary)]'}`}
          >
            Ver detalle
          </span>
        </div>
      </div>
    </article>
  )
}

function OrderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label-sm mb-1 uppercase tracking-wider text-[var(--color-outline)]">{label}</p>
      <p className="text-body-md font-semibold text-[var(--color-on-surface)]">{value}</p>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: SubOrderStatus }) {
  const classMap: Record<SubOrderStatus, string> = {
    pending: 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]',
    preparing: 'bg-[var(--color-surface-container-highest)] text-[var(--color-secondary)]',
    sent: 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]',
    delivered: 'bg-[#006a4e]/10 text-[#006a4e]',
    cancelled: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
  }

  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${classMap[status]}`}>
      {STATUS_DISPLAY_MAP[status]}
    </span>
  )
}
