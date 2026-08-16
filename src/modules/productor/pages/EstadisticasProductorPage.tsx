import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronRight, Loader2, PackageOpen } from 'lucide-react'
import { formatMoney, formatMoneyFromCents } from '../../../lib/formatMoney'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { useRevenueStatsQuery } from '../estadisticas/hooks/useRevenueStatsQuery'
import { useOrderCountStatsQuery } from '../estadisticas/hooks/useOrderCountStatsQuery'
import type { StatsWindow } from '../estadisticas/estadisticas.schema'
import { usePedidosQuery } from '../pedidos/hooks/usePedidosQuery'
import { getLinesSubtotalCents } from '../pedidos/pedidos.money'
import type { SubOrderListItemDTO, SubOrderStatus } from '../pedidos/pedidos.schema'
import { useProductosQuery } from '../productos/hooks/useProductosQuery'

const WINDOW_LABEL: Record<StatsWindow, string> = {
  '7d': '7 días',
  '30d': '30 días',
  '90d': '90 días',
  '1y': '1 año',
}

const WINDOW_SUBTITLE: Record<StatsWindow, string> = {
  '7d': 'Actividad de los últimos 7 días.',
  '30d': 'Rendimiento de los últimos 30 días.',
  '90d': 'Tendencia de los últimos 90 días.',
  '1y': 'Evolución de los últimos 365 días.',
}

const WINDOW_BUCKETS: Record<StatsWindow, number> = {
  '7d': 7,
  '30d': 6,
  '90d': 13,
  '1y': 12,
}

const STATUS_LABEL: Record<SubOrderStatus, string> = {
  pending: 'Pendiente',
  preparing: 'En preparación',
  sent: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

type ProductInfo = { name: string; imageUrl?: string }

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function isRevenueOrder(order: SubOrderListItemDTO) {
  return order.status === 'sent' || order.status === 'delivered'
}

function filterInclusive(orders: SubOrderListItemDTO[], from: Date, to: Date) {
  return orders.filter((order) => {
    const createdAt = new Date(order.createdAt).getTime()
    return Number.isFinite(createdAt) && createdAt >= from.getTime() && createdAt <= to.getTime()
  })
}

function sumOrderRevenue(orders: SubOrderListItemDTO[]) {
  let total = 0n
  for (const order of orders) {
    const subtotal = getLinesSubtotalCents(order.orderLines)
    if (subtotal === null) return null
    total += subtotal
  }
  return total
}

function buildTrend(orders: SubOrderListItemDTO[], from: Date, to: Date, window: StatsWindow) {
  const bucketCount = WINDOW_BUCKETS[window]
  const duration = Math.max(1, to.getTime() - from.getTime() + 1)
  const buckets = Array.from({ length: bucketCount }, (_, index) => ({
    label: formatDate(new Date(from.getTime() + (duration * index) / bucketCount)),
    value: 0n,
  }))

  for (const order of orders) {
    const subtotal = getLinesSubtotalCents(order.orderLines)
    if (subtotal === null) return null
    const elapsed = new Date(order.createdAt).getTime() - from.getTime()
    const index = Math.min(bucketCount - 1, Math.max(0, Math.floor((elapsed * bucketCount) / duration)))
    buckets[index].value += subtotal
  }

  return buckets
}

export function EstadisticasProductorPage() {
  const [activeWindow, setActiveWindow] = useState<StatsWindow>('30d')
  const revenueQuery = useRevenueStatsQuery(activeWindow)
  const orderCountQuery = useOrderCountStatsQuery(activeWindow)
  const pedidosQuery = usePedidosQuery()
  const productosQuery = useProductosQuery()

  const boundsSource = revenueQuery.data ?? orderCountQuery.data
  const rawFrom = boundsSource ? new Date(boundsSource.from) : null
  const rawTo = boundsSource ? new Date(boundsSource.to) : null
  const bounds = rawFrom !== null && rawTo !== null && Number.isFinite(rawFrom.getTime()) && Number.isFinite(rawTo.getTime())
    ? { from: rawFrom, to: rawTo }
    : null
  const periodOrders = bounds ? filterInclusive(pedidosQuery.data ?? [], bounds.from, bounds.to) : []
  const revenueOrders = periodOrders.filter(isRevenueOrder)
  const derivedRevenue = sumOrderRevenue(revenueOrders)
  const averageTicket = derivedRevenue !== null && revenueOrders.length > 0
    ? derivedRevenue / BigInt(revenueOrders.length)
    : null
  const trend = bounds ? buildTrend(revenueOrders, bounds.from, bounds.to, activeWindow) : null
  const maxTrend = trend?.reduce((maximum, bucket) => bucket.value > maximum ? bucket.value : maximum, 0n) ?? 0n

  const products = new Map<string, ProductInfo>()
  for (const product of productosQuery.data ?? []) {
    products.set(product.id, { name: product.name, imageUrl: product.images?.[0]?.url })
  }

  const productSales = new Map<string, { quantity: number; revenue: bigint }>()
  for (const order of revenueOrders) {
    for (const line of order.orderLines) {
      const lineTotal = getLinesSubtotalCents([line])
      if (lineTotal === null) continue
      const current = productSales.get(line.productId) ?? { quantity: 0, revenue: 0n }
      productSales.set(line.productId, {
        quantity: current.quantity + line.quantity,
        revenue: current.revenue + lineTotal,
      })
    }
  }
  const topProducts = [...productSales.entries()]
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .slice(0, 5)

  const boundsError = !boundsSource && revenueQuery.isError && orderCountQuery.isError
  const invalidBounds = boundsSource !== undefined && bounds === null
  const dataLoading = pedidosQuery.isLoading || (!boundsSource && !boundsError)
  const dataError = pedidosQuery.isError || boundsError || invalidBounds || (revenueOrders.length > 0 && derivedRevenue === null)
  const dataErrorValue = pedidosQuery.error ?? revenueQuery.error ?? orderCountQuery.error
  const dataErrorMessage = invalidBounds
    ? 'El servicio de estadísticas devolvió un rango de fechas no válido.'
    : derivedRevenue === null && revenueOrders.length > 0
      ? 'No se pudieron interpretar los importes históricos de algunos pedidos.'
      : dataError ? resolveErrorMessage(dataErrorValue) : null
  const catalogLoading = dataLoading || productosQuery.isLoading
  const catalogError = dataError || productosQuery.isError
  const catalogErrorMessage = dataErrorMessage ?? (productosQuery.isError ? resolveErrorMessage(productosQuery.error) : null)

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav aria-label="Breadcrumb" className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]">
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">Área Productor</Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Estadísticas</span>
          </nav>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">Estadísticas</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Consulta el rendimiento comercial real de tu tienda. Los importes de ventas excluyen el envío.
              </p>
            </div>
            <div className="inline-flex w-full max-w-full flex-wrap border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-surface-container-low)] p-1 sm:w-auto">
              {(Object.keys(WINDOW_LABEL) as StatsWindow[]).map((window) => (
                <button
                  key={window}
                  type="button"
                  onClick={() => setActiveWindow(window)}
                  className={`text-label-md px-4 py-3 transition-colors ${activeWindow === window ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                >
                  {WINDOW_LABEL[window]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6">
            <p className="text-label-sm mb-2 uppercase tracking-[0.18em] text-[var(--color-secondary)]">Período seleccionado</p>
            <h2 className="text-headline-md text-[var(--color-on-surface)]">{WINDOW_LABEL[activeWindow]}</h2>
            <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">{WINDOW_SUBTITLE[activeWindow]}</p>
          </article>
          <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6">
            <div className="mb-3 flex items-center gap-3 text-[var(--color-primary)]">
              <CalendarDays size={20} strokeWidth={1.8} />
              <p className="text-label-sm uppercase tracking-[0.18em] text-[var(--color-secondary)]">Rango consultado</p>
            </div>
            <h2 className="text-headline-md text-[var(--color-on-surface)]">
              {bounds ? `${formatDate(bounds.from)} - ${formatDate(bounds.to)}` : boundsError || invalidBounds ? 'Rango no disponible' : 'Cargando rango...'}
            </h2>
            <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">Ventana móvil informada por el servicio de estadísticas.</p>
          </article>
        </section>

        <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3" aria-label="Indicadores clave">
          <KpiCard label="Ingresos confirmados" loading={revenueQuery.isLoading} error={revenueQuery.isError ? resolveErrorMessage(revenueQuery.error) : null}>
            <strong className="text-headline-md text-[var(--color-on-surface)]">{revenueQuery.data ? formatMoney(revenueQuery.data.totalRevenue) : '—'}</strong>
            <span className="text-body-sm mt-2 text-[var(--color-secondary)]">Envíos enviados o entregados, sin gastos de envío</span>
          </KpiCard>
          <KpiCard label="Pedidos no cancelados" loading={orderCountQuery.isLoading} error={orderCountQuery.isError ? resolveErrorMessage(orderCountQuery.error) : null}>
            <strong className="text-headline-md text-[var(--color-on-surface)]">{orderCountQuery.data ? orderCountQuery.data.count : '—'}</strong>
            <span className="text-body-sm mt-2 text-[var(--color-secondary)]">Pendientes, en preparación, enviados y entregados</span>
          </KpiCard>
          <KpiCard label="Ticket medio confirmado" loading={dataLoading} error={dataErrorMessage}>
            <strong className="text-headline-md text-[var(--color-on-surface)]">{formatMoneyFromCents(averageTicket)}</strong>
            <span className="text-body-sm mt-2 text-[var(--color-secondary)]">Subtotal medio de envíos enviados o entregados</span>
          </KpiCard>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Evolución de ventas confirmadas</h2>
            <p className="text-label-md mt-2 text-[var(--color-secondary)]">Subtotales de líneas por fecha de creación, sin gastos de envío</p>
          </div>
          <DataState loading={dataLoading} error={dataErrorMessage} empty={revenueOrders.length === 0} emptyMessage="No hay ventas enviadas o entregadas en este período.">
            <div className="space-y-4 border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6 md:p-8">
              {trend?.map((bucket) => {
                const width = maxTrend > 0n ? (bucket.value * 100n) / maxTrend : 0n
                return (
                  <div key={bucket.label} className="grid grid-cols-[5.5rem_1fr_6rem] items-center gap-3 sm:grid-cols-[7rem_1fr_8rem]">
                    <span className="text-label-sm text-[var(--color-secondary)]">{bucket.label}</span>
                    <span className="h-3 overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]">
                      <span className="block h-full rounded-full bg-[var(--color-primary-container)]" style={{ width: `${width.toString()}%` }} />
                    </span>
                    <span className="text-label-md text-right text-[var(--color-on-surface)]">{formatMoneyFromCents(bucket.value)}</span>
                  </div>
                )
              })}
            </div>
          </DataState>
        </section>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Productos más vendidos</h3>
              <Link to="/productor/productos" className="text-label-md text-[var(--color-primary)] hover:underline">Ver catálogo</Link>
            </div>
            <DataState loading={catalogLoading} error={catalogError ? catalogErrorMessage : null} empty={topProducts.length === 0} emptyMessage="No hay productos vendidos en este período.">
              <div className="divide-y divide-[var(--color-outline-variant)] border-y border-[var(--color-outline-variant)]">
                {topProducts.map(([productId, metric]) => {
                  const product = products.get(productId)
                  return (
                    <article key={productId} className="flex items-center gap-4 py-4">
                      {product?.imageUrl ? <img src={product.imageUrl} alt="" className="size-12 object-cover" /> : <NeutralProductImage />}
                      <div className="min-w-0 flex-1">
                        <p className="text-body-md truncate font-semibold text-[var(--color-on-surface)]">{product?.name ?? 'Producto no disponible'}</p>
                        <p className="text-label-sm text-[var(--color-secondary)]">{metric.quantity} unidad{metric.quantity === 1 ? '' : 'es'}</p>
                      </div>
                      <strong className="text-label-md text-[var(--color-primary)]">{formatMoneyFromCents(metric.revenue)}</strong>
                    </article>
                  )
                })}
              </div>
            </DataState>
          </div>

          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Pedidos recientes</h3>
              <Link to="/productor/pedidos" className="text-label-md text-[var(--color-primary)] hover:underline">Ver todos</Link>
            </div>
            <DataState loading={dataLoading} error={dataErrorMessage} empty={periodOrders.length === 0} emptyMessage="No hay pedidos en este período.">
              <div className="divide-y divide-[var(--color-outline-variant)] border-y border-[var(--color-outline-variant)]">
                {periodOrders.slice(0, 5).map((order) => (
                  <article key={order.id} className="flex items-center justify-between gap-4 py-5">
                    <div>
                      <p className="text-body-md font-semibold text-[var(--color-on-surface)]">Pedido #{order.id.slice(0, 8)}</p>
                      <p className="text-label-sm mt-1 text-[var(--color-secondary)]">{formatDate(new Date(order.createdAt))} · {STATUS_LABEL[order.status]}</p>
                    </div>
                    <span className="text-right">
                      <span className="text-label-md block text-[var(--color-primary)]">{formatMoneyFromCents(getLinesSubtotalCents(order.orderLines))}</span>
                      <span className="text-label-sm text-[var(--color-outline)]">Total de líneas</span>
                    </span>
                  </article>
                ))}
              </div>
            </DataState>
          </div>
        </section>
      </main>
    </div>
  )
}

function KpiCard({ label, loading, error, children }: { label: string; loading: boolean; error: string | null; children: ReactNode }) {
  return (
    <article className="flex min-h-44 flex-col border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-8">
      <span className="text-label-sm mb-4 uppercase tracking-[0.1em] text-[var(--color-secondary)]">{label}</span>
      {loading ? <Loader2 size={22} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" /> : error ? <span role="alert" className="text-body-md text-[var(--color-error)]">{error}</span> : children}
    </article>
  )
}

function DataState({ loading, error, empty, emptyMessage, children }: { loading: boolean; error: string | null; empty: boolean; emptyMessage: string; children: ReactNode }) {
  if (loading) return <div className="flex min-h-32 items-center justify-center border border-[var(--color-outline-variant)]"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
  if (error) return <div role="alert" className="border border-[var(--color-error)] bg-[var(--color-error-container)] p-6 text-[var(--color-on-error-container)]">{error}</div>
  if (empty) return <div className="border border-dashed border-[var(--color-outline-variant)] p-10 text-center text-[var(--color-on-surface-variant)]">{emptyMessage}</div>
  return children
}

function NeutralProductImage() {
  return <span role="img" aria-label="Imagen de producto no disponible" className="flex size-12 flex-none items-center justify-center bg-[var(--color-surface-container-high)] text-[var(--color-outline)]"><PackageOpen size={20} strokeWidth={1.5} /></span>
}
