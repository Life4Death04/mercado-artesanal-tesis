import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight, Loader2, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import { useRevenueStatsQuery } from '../estadisticas/hooks/useRevenueStatsQuery'
import { useOrderCountStatsQuery } from '../estadisticas/hooks/useOrderCountStatsQuery'
import { useLowStockStatsQuery } from '../estadisticas/hooks/useLowStockStatsQuery'
import { usePedidosQuery } from '../pedidos/hooks/usePedidosQuery'
import { useProductosQuery } from '../productos/hooks/useProductosQuery'
import { resolveOrderProduct, type OrderProductCatalog } from '../pedidos/orderProductCatalog'
import { formatMoney } from '../../../lib/formatMoney'
import { resolveErrorMessage } from '../../../lib/errorMessages'

// ---------------------------------------------------------------------------
// ProductorDashboardPage
// Wired to backend stats endpoints (sales-stats spec) and orders hook.
// KPIs are backend-computed — no client-side money arithmetic (money-typing R2).
// ---------------------------------------------------------------------------

export function ProductorDashboardPage() {
  // Default window: 30d (last month) for the dashboard summary
  const { data: revenue, isLoading: revLoading, isError: revError, error: revErr } = useRevenueStatsQuery('30d')
  const { data: orderCount, isLoading: countLoading } = useOrderCountStatsQuery('30d')
  const { data: lowStock, isLoading: stockLoading } = useLowStockStatsQuery()
  // Fetch pending orders for the dashboard "attention required" section.
  // Read isError/error to fail CLOSED: on 401/5xx/offline, data may be undefined
  // even with the default, so we gate the empty-state on query success only.
  const {
    data: pedidosPending,
    isLoading: pedidosLoading,
    isError: pedidosError,
    error: pedidosErr,
  } = usePedidosQuery('pending')
  const {
    data: productos,
    isLoading: isCatalogLoading,
    isError: isCatalogError,
  } = useProductosQuery()
  const productCatalog: OrderProductCatalog = isCatalogLoading
    ? { status: 'loading' }
    : isCatalogError || productos === undefined
      ? { status: 'unavailable' }
      : { status: 'ready', products: productos }

  const isLoading = revLoading || countLoading || stockLoading || pedidosLoading

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        {/* Header */}
        <section className="mb-10">
          <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">Panel del productor</h1>
          <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
            Resumen operativo de tu tienda. Los indicadores reflejan los últimos 30 días.
          </p>
        </section>

        {revError ? (
          <div
            role="alert"
            aria-live="polite"
            className="mb-8 border border-[var(--color-error)] bg-[var(--color-error-container)] px-5 py-4 text-sm text-[var(--color-on-error-container)]"
          >
            {resolveErrorMessage(revErr)}
          </div>
        ) : null}

        {/* KPI strip — backend-computed (Cycle 2 stats endpoints) */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Indicadores clave">
          {/* Ingresos — 30d */}
          <div className="flex flex-col gap-3 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_10px_30px_-20px_rgba(122,46,58,0.2)]">
            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <TrendingUp size={18} strokeWidth={1.8} />
              <span className="text-label-sm uppercase tracking-[0.18em]">Ingresos (30d)</span>
            </div>
            {revLoading ? (
              <Loader2 size={20} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" />
            ) : (
              /*
                money-typing R2-R4: totalRevenue is a Decimal string from the backend.
                Display ONLY via formatMoney. NEVER perform arithmetic on it.
              */
              <strong className="text-headline-md text-[28px] text-[var(--color-primary)]">
                {revenue ? formatMoney(revenue.totalRevenue) : '—'}
              </strong>
            )}
          </div>

          {/* Pedidos — 30d */}
          <div className="flex flex-col gap-3 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_10px_30px_-20px_rgba(122,46,58,0.2)]">
            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <ShoppingBag size={18} strokeWidth={1.8} />
              <span className="text-label-sm uppercase tracking-[0.18em]">Pedidos (30d)</span>
            </div>
            {countLoading ? (
              <Loader2 size={20} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" />
            ) : (
              /* count is an integer (not money) — safe to display as number */
              <strong className="text-headline-md text-[28px] text-[var(--color-primary)]">
                {orderCount ? String(orderCount.count) : '—'}
              </strong>
            )}
          </div>

          {/* Alertas stock bajo */}
          <div className="flex flex-col gap-3 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_10px_30px_-20px_rgba(122,46,58,0.2)]">
            <div className="flex items-center gap-2 text-[var(--color-secondary)]">
              <AlertTriangle size={18} strokeWidth={1.8} />
              <span className="text-label-sm uppercase tracking-[0.18em]">Stock bajo</span>
            </div>
            {stockLoading ? (
              <Loader2 size={20} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" />
            ) : (
              <strong
                className={`text-headline-md text-[28px] ${lowStock && lowStock.total > 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-primary)]'}`}
              >
                {lowStock ? String(lowStock.total) : '—'}
              </strong>
            )}
          </div>
        </section>

        {/* Pending orders requiring attention */}
        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-headline-md text-[22px] text-[var(--color-on-surface)]">
              Pedidos pendientes de gestión
            </h2>
            <Link
              to="/productor/pedidos"
              className="text-label-md flex items-center gap-1 text-[var(--color-primary)] hover:underline"
            >
              Ver todos <ChevronRight size={16} strokeWidth={1.8} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={28} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" />
            </div>
          ) : pedidosError ? (
            // Fail CLOSED: never show the empty-success copy when the query actually failed.
            // A 401, 5xx, or offline error must surface an explicit blocked state here.
            <div
              role="alert"
              aria-live="polite"
              className="flex flex-col items-center justify-center gap-3 border border-[var(--color-error)] bg-[var(--color-error-container)] py-12 text-center"
            >
              <AlertTriangle size={32} strokeWidth={1.5} className="text-[var(--color-error)]" />
              <p className="text-body-md text-[var(--color-on-error-container)]">
                No se pudieron cargar los pedidos pendientes.
              </p>
              <p className="text-label-sm text-[var(--color-on-error-container)] opacity-75">
                {resolveErrorMessage(pedidosErr)}
              </p>
            </div>
          ) : pedidosPending === undefined || pedidosPending.length === 0 ? (
            // Empty-success state: only shown after a successful query that returned [].
            <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--color-outline-variant)] py-12 text-center">
              <Package size={32} strokeWidth={1.5} className="text-[var(--color-outline)]" />
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                No hay pedidos pendientes en este momento.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {pedidosPending.slice(0, 5).map((pedido) => {
                const productSummary = pedido.orderLines
                  .map((line) => {
                    const product = resolveOrderProduct(line.productId, productCatalog)
                    return `${product.name} (${line.quantity})`
                  })
                  .join(', ')

                return (
                  <li
                    key={pedido.id}
                    className="flex items-center justify-between gap-4 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-body-md font-semibold text-[var(--color-primary)]">Entrega #{pedido.subOrderNumber}</p>
                      <p className="text-label-sm text-[var(--color-secondary)]">Pedido #{pedido.order.orderNumber}</p>
                      <p className="text-label-sm max-w-full break-all font-mono text-[var(--color-outline)]">ID técnico: {pedido.id}</p>
                      {pedido.consumerName ? (
                        <p className="text-body-md font-medium text-[var(--color-on-surface)]">
                          {pedido.consumerName}
                        </p>
                      ) : null}
                      {productSummary ? (
                        <p className="text-label-sm truncate text-[var(--color-secondary)]">
                          {productSummary}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="text-label-sm rounded-full bg-[var(--color-secondary-container)] px-3 py-1 text-[var(--color-on-secondary-container)]">
                        Pendiente
                      </span>
                      <Link
                        to="/productor/pedidos"
                        className="text-label-md border-b border-[var(--color-primary)] text-[var(--color-primary)] transition-all"
                      >
                        Gestionar
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Low-stock alerts */}
        {lowStock && lowStock.total > 0 ? (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-headline-md text-[22px] text-[var(--color-on-surface)]">
                Alertas de stock bajo
              </h2>
              <Link
                to="/productor/inventario"
                className="text-label-md flex items-center gap-1 text-[var(--color-primary)] hover:underline"
              >
                Ver inventario <ChevronRight size={16} strokeWidth={1.8} />
              </Link>
            </div>

            <ul className="flex flex-col gap-3">
              {lowStock.items.slice(0, 5).map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-4 border border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] bg-[var(--color-surface-container-lowest)] px-5 py-4"
                >
                  <div>
                    <p className="text-body-md font-medium text-[var(--color-on-surface)]">{item.name}</p>
                    <p className="text-label-sm text-[var(--color-secondary)]">
                      Stock: {item.stock} / Umbral: {item.lowStockThreshold}
                    </p>
                  </div>
                  <span className="text-label-sm rounded-full bg-[var(--color-error-container)] px-3 py-1 text-[var(--color-on-error-container)]">
                    Stock bajo
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  )
}
