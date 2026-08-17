import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { OrderDetailModal } from '../componentes/ConsumerOrderModals'
import { ReportarIncidenciaModal } from '../../perfil/componentes/IncidenciaModals'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { orderIdSchema, type ConsumerOrder as ConsumerOrderResponse, type OrderSummary } from '../pedidos.schema'
import { useCancelConsumerOrderMutation } from '../hooks/useCancelConsumerOrderMutation'
import { useConsumerOrderQuery } from '../hooks/useConsumerOrderQuery'
import { useConsumerOrdersQuery } from '../hooks/useConsumerOrdersQuery'

export type ConsumerOrderStatus = 'Pendiente' | 'Confirmado' | 'En preparación' | 'En camino' | 'Entregado' | 'Cancelado'

export type ConsumerOrderProduct = {
  name: string
  detail: string
  quantity: string
  unitPrice: string
  total: string
  image: string
}

export type ConsumerSubOrder = {
  id: string
  producer: string
  location: string
  status: ConsumerOrderStatus
  deliveryMethod: string
  deliveryAddress: string
  tracking: string
  subtotal: string
  shipping: string
  total: string
  incidentId?: string
  canReportIncident: boolean
  reportIncidentUnavailableReason: string | null
  products: ConsumerOrderProduct[]
}

export type ConsumerOrder = {
  id: string
  orderNumber: number
  date: string
  dateISO: string
  status: ConsumerOrderStatus
  total: string
  address: string
  paymentStatus?: string
  subOrders: ConsumerSubOrder[]
}

type DateFilters = {
  from: string
  to: string
}

const orderStatusFilters: Array<ConsumerOrderStatus | 'Todos'> = [
  'Todos',
  'Pendiente',
  'Confirmado',
  'En preparación',
  'En camino',
  'Entregado',
  'Cancelado',
]

const pageSize = 5

export function HistorialPedidosPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') ?? ''
  const [search, setSearch] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState<ConsumerOrderStatus | 'Todos'>('Todos')
  const [dateFilters, setDateFilters] = useState<DateFilters>({ from: '', to: '' })
  const [showDateFilters, setShowDateFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const requestedOrderId = searchParams.get('orderId')
  const selectedOrderId = requestedOrderId && orderIdSchema.safeParse(requestedOrderId).success ? requestedOrderId : null
  const hasMalformedOrderId = requestedOrderId !== null && selectedOrderId === null
  const [reportSubOrder, setReportSubOrder] = useState<ConsumerSubOrder | null>(null)
  const [incidentSuccess, setIncidentSuccess] = useState<string | null>(null)

  const ordersQuery = useConsumerOrdersQuery()
  const detailQuery = useConsumerOrderQuery(selectedOrderId)
  const cancelMutation = useCancelConsumerOrderMutation()
  const resetCancelMutation = cancelMutation.reset
  const cancelStartedRef = useRef(false)
  const orders = ordersQuery.data?.map(toOrderSummaryView) ?? []

  const normalizedSearch = search.trim().toLowerCase()
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !normalizedSearch ||
      [String(order.orderNumber), order.id, order.address, order.status, ...order.subOrders.flatMap((subOrder) => [
        subOrder.id,
        subOrder.producer,
        subOrder.location,
        subOrder.incidentId ?? '',
        ...subOrder.products.map((product) => product.name),
      ])]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter || order.subOrders.some((subOrder) => subOrder.status === statusFilter)
    const matchesFrom = !dateFilters.from || order.dateISO >= dateFilters.from
    const matchesTo = !dateFilters.to || order.dateISO <= dateFilters.to

    return matchesSearch && matchesStatus && matchesFrom && matchesTo
  })
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const visibleOrders = filteredOrders.slice((safePage - 1) * pageSize, safePage * pageSize)
  const selectedOrder = detailQuery.data?.id === selectedOrderId && !detailQuery.isFetching && !detailQuery.isError ? toOrderDetailView(detailQuery.data) : null

  useEffect(() => {
    cancelStartedRef.current = false
    resetCancelMutation()
  }, [selectedOrderId, resetCancelMutation])

  function updateSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateStatusFilter(filter: ConsumerOrderStatus | 'Todos') {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  function updateDateFilter(key: keyof DateFilters, value: string) {
    setDateFilters((current) => ({ ...current, [key]: value }))
    setCurrentPage(1)
  }

  function selectOrder(orderId: string | null) {
    cancelStartedRef.current = false
    resetCancelMutation()
    setSearchParams((current) => {
      if (orderId) current.set('orderId', orderId)
      else current.delete('orderId')
      return current
    })
  }

  function cancelOrder(orderId: string) {
    if (cancelStartedRef.current) return
    cancelStartedRef.current = true
    cancelMutation.mutate(orderId, { onSettled: () => { cancelStartedRef.current = false } })
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-16 md:px-[var(--space-margin-desktop)] md:py-24">
        <section className="mb-10">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-outline)]">
            <Link to="/perfil" className="transition-colors hover:text-[var(--color-primary)]">
              Mi cuenta
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-on-surface)]">Mis pedidos</span>
          </nav>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-on-surface)]">Mis pedidos</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Revisa el historial de tus compras y abre cada entrega para consultar su estado o reportar una incidencia.
              </p>
            </div>
            <div className="border border-[color-mix(in_srgb,var(--color-outline-variant)_40%,transparent)] bg-white/45 px-5 py-4 text-right">
              <span className="text-label-sm block uppercase tracking-[0.18em] text-[var(--color-outline)]">Pedidos filtrados</span>
               <strong className="text-headline-md text-[28px] text-[#7A2E3A]">{filteredOrders.length}</strong>
            </div>
          </div>
        </section>

        <section className="mb-8 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-4 shadow-[0_18px_50px_-35px_rgba(122,46,58,0.35)] md:p-6" aria-label="Filtros de pedidos">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} strokeWidth={1.8} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-outline)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por pedido, producto, productor o incidencia..."
                className="text-body-md w-full border border-[var(--color-outline-variant)] bg-[#FAF7F0] py-3 pr-4 pl-11 text-[#1A1A1A] placeholder:text-[var(--color-outline)] focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowDateFilters((value) => !value)}
              className="text-label-md inline-flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 uppercase tracking-wider text-[var(--color-secondary)] transition-colors hover:border-[#7A2E3A] hover:text-[#7A2E3A]"
            >
              <SlidersHorizontal size={18} strokeWidth={1.8} />
              Fechas
            </button>
          </div>

          {showDateFilters ? (
            <div className="mt-5 grid gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-5 sm:grid-cols-2">
              <DateField label="Desde" value={dateFilters.from} onChange={(value) => updateDateFilter('from', value)} />
              <DateField label="Hasta" value={dateFilters.to} onChange={(value) => updateDateFilter('to', value)} />
            </div>
          ) : null}

          <div className="mt-5 flex gap-3 overflow-x-auto border-t border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] pt-5">
            {orderStatusFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => updateStatusFilter(filter)}
                className={`text-label-md whitespace-nowrap rounded-full border px-4 py-2 transition-all ${statusFilter === filter ? 'border-[#7A2E3A] bg-[#7A2E3A] text-white' : 'border-[var(--color-outline-variant)] bg-transparent text-[var(--color-on-surface-variant)] hover:border-[#7A2E3A] hover:text-[#7A2E3A]'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

         {ordersQuery.isLoading ? <p className="text-body-md py-10 text-[var(--color-on-surface-variant)]">Cargando tus pedidos...</p> : null}
         {ordersQuery.isError ? <p role="alert" className="text-body-md border border-[var(--color-error)] p-5 text-[var(--color-error)]">{resolveErrorMessage(ordersQuery.error)}</p> : null}
         <div className="flex flex-col gap-4">
           {visibleOrders.map((order) => (
              <OrderRow key={order.id} order={order} highlighted={normalizedSearch.length > 0 && (String(order.orderNumber).includes(normalizedSearch) || order.id.toLowerCase().includes(normalizedSearch))} onView={() => selectOrder(order.id)} />
           ))}
        </div>

        {visibleOrders.length === 0 ? (
          <div className="mt-10 border border-dashed border-[var(--color-outline-variant)] p-10 text-center">
            <Filter className="mx-auto mb-3 text-[var(--color-outline)]" size={28} strokeWidth={1.8} />
            <p className="text-body-md text-[var(--color-on-surface-variant)]">No hay pedidos que coincidan con los filtros aplicados.</p>
          </div>
        ) : null}

        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>


      {selectedOrder ? (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => selectOrder(null)}
           onReport={(subOrder) => {
             setIncidentSuccess(null)
             setReportSubOrder(subOrder)
           }}
          onCancel={selectedOrder.status === 'Pendiente' ? () => cancelOrder(selectedOrder.id) : undefined}
          isCancelling={cancelMutation.variables === selectedOrder.id && cancelMutation.isPending}
          cancelError={cancelMutation.variables === selectedOrder.id && cancelMutation.isError ? resolveErrorMessage(cancelMutation.error) : null}
        />
      ) : null}

      {selectedOrderId && detailQuery.isLoading ? <p className="sr-only" aria-live="polite">Cargando detalle del pedido...</p> : null}
      {hasMalformedOrderId || (selectedOrderId !== null && detailQuery.isError) ? <div role="alert" className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-xl border border-[var(--color-error)] bg-white p-4 text-[var(--color-error)]">No pudimos abrir este pedido. Vuelve al historial para continuar de forma segura.</div> : null}

      {reportSubOrder ? (
        <ReportarIncidenciaModal
          subOrderId={reportSubOrder.id}
          onClose={() => setReportSubOrder(null)}
          onCreated={(incidentId) => setIncidentSuccess(`La incidencia ${incidentId} se creó correctamente.`)}
        />
      ) : null}
      {incidentSuccess ? <div role="status" aria-live="polite" className="fixed inset-x-4 bottom-6 z-[60] mx-auto flex max-w-xl items-center justify-between gap-4 border border-green-700 bg-green-50 p-4 text-green-900 shadow-lg"><span>{incidentSuccess}</span><button type="button" onClick={() => setIncidentSuccess(null)} className="text-label-sm underline">Cerrar</button></div> : null}
    </div>
  )
}

function toOrderSummaryView(order: OrderSummary): ConsumerOrder {
  return { id: order.id, orderNumber: order.orderNumber, date: formatDate(order.createdAt), dateISO: order.createdAt.slice(0, 10), status: toDisplayStatus(order.status), total: formatAmount(order.totalAmount), address: '', subOrders: [] }
}

function toOrderDetailView(order: ConsumerOrderResponse): ConsumerOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    date: formatDate(order.createdAt),
    dateISO: order.createdAt.slice(0, 10),
    status: toDisplayStatus(order.status),
    total: formatAmount(order.totalAmount),
    address: '',
    paymentStatus: toPaymentStatusLabel(order.payment.status),
    subOrders: order.subOrders.map((subOrder) => ({
      id: subOrder.id,
      producer: 'Entrega',
      location: '',
      status: toDisplaySubOrderStatus(subOrder.status),
      deliveryMethod: { PERSONAL_DELIVERY: 'Entrega personal', PICKUP: 'Recogida', SHIPPING_FLAT_RATE: 'Envío' }[subOrder.deliveryMode.type],
      deliveryAddress: '',
      tracking: subOrder.trackingNumber ?? '',
      subtotal: '',
      shipping: formatAmount(subOrder.shippingCostSnapshot),
      total: '',
      canReportIncident: order.payment.status === 'SUCCEEDED' && subOrder.status !== 'cancelled',
      reportIncidentUnavailableReason: order.payment.status !== 'SUCCEEDED'
        ? 'La entrega requiere un pago confirmado.'
        : subOrder.status === 'cancelled'
          ? 'No se pueden reportar incidencias sobre entregas canceladas.'
          : null,
      products: subOrder.orderLines.map((line) => ({ name: '', detail: '', quantity: `${line.quantity}x`, unitPrice: formatAmount(line.unitPriceSnapshot), total: '', image: '' })),
    })),
  }
}

function toDisplayStatus(status: 'PENDING' | 'PARTIAL' | 'FULFILLED' | 'CANCELLED'): ConsumerOrderStatus {
  const labels: Record<'PENDING' | 'PARTIAL' | 'FULFILLED' | 'CANCELLED', ConsumerOrderStatus> = { PENDING: 'Pendiente', PARTIAL: 'En preparación', FULFILLED: 'Entregado', CANCELLED: 'Cancelado' }
  return labels[status]
}

function toDisplaySubOrderStatus(status: 'pending' | 'preparing' | 'sent' | 'delivered' | 'cancelled'): ConsumerOrderStatus {
  const labels: Record<'pending' | 'preparing' | 'sent' | 'delivered' | 'cancelled', ConsumerOrderStatus> = { pending: 'Pendiente', preparing: 'En preparación', sent: 'En camino', delivered: 'Entregado', cancelled: 'Cancelado' }
  return labels[status]
}

function toPaymentStatusLabel(status: ConsumerOrderResponse['payment']['status']) {
  const labels: Record<ConsumerOrderResponse['payment']['status'], string> = { PENDING: 'Pendiente', SUCCEEDED: 'Confirmado', FAILED: 'Fallido', CANCELED: 'Cancelado', REFUNDED: 'Reembolsado' }
  return labels[status]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES').format(new Date(value))
}

function formatAmount(value: string) {
  return `${value} €`
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-label-sm uppercase tracking-wider text-[var(--color-outline)]">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-md border border-[var(--color-outline-variant)] bg-[#FAF7F0] px-4 py-3 text-[#1A1A1A] focus:border-[#7A2E3A] focus:ring-0 focus:outline-none"
      />
    </label>
  )
}

function OrderRow({ order, highlighted, onView }: { order: ConsumerOrder; highlighted: boolean; onView: () => void }) {
  return (
    <article
      className={`group relative flex flex-col gap-6 rounded-[var(--radius-lg)] border p-6 transition-colors md:flex-row md:items-center md:justify-between ${
        highlighted
          ? 'border-[#7A2E3A] bg-[color-mix(in_srgb,#7A2E3A_8%,white)] shadow-[0_18px_45px_-32px_rgba(122,46,58,0.65)]'
          : 'border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] bg-white/50 hover:border-[var(--color-outline-variant)]'
      }`}
    >
      <div className="flex flex-grow flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <OrderMeta label="Nº de pedido" value={`#${order.orderNumber}`} technicalId={order.id} />
        <OrderMeta label="Fecha" value={order.date} />
        <OrderMeta label="Total del pedido" value={order.total} grow />
      </div>

      <div className="flex min-w-[220px] items-center justify-between gap-6 md:justify-end">
        <StatusBadge status={order.status} />
        <button type="button" onClick={onView} className="text-label-md flex items-center gap-1 text-[#1A1A1A] transition-colors hover:underline hover:text-[#7A2E3A]">
          Ver detalle
          <ArrowRight size={18} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  )
}

function OrderMeta({ label, value, technicalId, grow = false }: { label: string; value: string; technicalId?: string; grow?: boolean }) {
  return (
    <div className={grow ? 'flex-grow' : 'min-w-[100px]'}>
      <span className="text-label-sm mb-1 block text-[var(--color-on-surface-variant)]">{label}</span>
      <span className="text-body-md font-medium text-[#1A1A1A]">{value}</span>
      {technicalId ? <span className="text-label-sm mt-1 block max-w-64 break-all font-mono text-[var(--color-outline)]">ID técnico: {technicalId}</span> : null}
    </div>
  )
}

function StatusBadge({ status }: { status: ConsumerOrderStatus }) {
  const completed = status === 'Entregado'
  const cancelled = status === 'Cancelado'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${completed ? 'border-green-200 bg-green-50 text-green-800' : cancelled ? 'border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]' : 'border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] bg-[var(--color-surface-container-high)] text-[#1A1A1A]'}`}>
      {completed ? <CheckCircle2 size={14} strokeWidth={1.8} className="mr-1" /> : <span className="mr-1.5 size-1.5 rounded-full bg-[var(--color-primary)]" />}
      {status}
    </span>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="mt-16 flex items-center justify-center gap-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_30%,transparent)] pt-8">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-outline)] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={18} strokeWidth={1.8} />
      </button>
      <div className="text-label-md flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} type="button" onClick={() => onPageChange(page)} className={`flex size-10 items-center justify-center rounded-full transition-colors ${page === currentPage ? 'bg-[var(--color-surface-container-high)] text-[#1A1A1A]' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}>
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex size-10 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-outline)] transition-colors hover:border-[#1A1A1A] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={18} strokeWidth={1.8} />
      </button>
    </div>
  )
}
