import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronDown, ChevronRight, Loader2, TrendingDown, TrendingUp } from 'lucide-react'
import { SeleccionPeriodoModal } from '../componentes/SeleccionPeriodoModal'
import { useRevenueStatsQuery } from '../estadisticas/hooks/useRevenueStatsQuery'
import { useOrderCountStatsQuery } from '../estadisticas/hooks/useOrderCountStatsQuery'
import { formatMoney } from '../../../lib/formatMoney'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import type { StatsWindow } from '../estadisticas/estadisticas.schema'

// ---------------------------------------------------------------------------
// Window → display label mapping
// [source: sales-stats/spec.md — window values: '7d' | '30d' | '90d' | '1y']
// ---------------------------------------------------------------------------

type PeriodoTab = '7d' | '30d' | '90d' | '1y' | 'custom'

const WINDOW_LABEL: Record<StatsWindow, string> = {
  '7d': 'Semana',
  '30d': 'Mes',
  '90d': 'Trimestre',
  '1y': 'Año',
}

const WINDOW_SUBTITLE: Record<StatsWindow, string> = {
  '7d': 'Comparativa semanal de actividad y ventas.',
  '30d': 'Vista consolidada del rendimiento mensual.',
  '90d': 'Lectura extendida para detectar tendencias.',
  '1y': 'Vista anual del rendimiento de tu tienda.',
}

const WINDOW_RANGE_LABEL: Record<StatsWindow, string> = {
  '7d': 'Ultimos 7 dias',
  '30d': 'Ultimo mes natural',
  '90d': 'Ultimos 3 meses',
  '1y': 'Ultimo año',
}

// Chart x-axis labels per window (decorative — real chart data deferred to Cycle 3)
const WINDOW_XLABELS: Record<StatsWindow, string[]> = {
  '7d': ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
  '30d': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  '90d': ['Mes 1', 'Mes 2', 'Mes 3'],
  '1y': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
}

function formatRangeDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// ---------------------------------------------------------------------------
// EstadisticasProductorPage
// ---------------------------------------------------------------------------

export function EstadisticasProductorPage() {
  // Active window — defaults to 30d (was 'Mes' in the hardcoded version)
  const [activeWindow, setActiveWindow] = useState<StatsWindow>('30d')
  const [showPeriodoModal, setShowPeriodoModal] = useState(false)
  const [customStart, setCustomStart] = useState<Date>(new Date(2023, 8, 12))
  const [customEnd, setCustomEnd] = useState<Date>(new Date(2023, 9, 24))
  const [isCustom, setIsCustom] = useState(false)

  // Data hooks — backend-computed, no client-side KPI arithmetic
  const { data: revenue, isLoading: revLoading, isError: revError, error: revErr } = useRevenueStatsQuery(activeWindow)
  const { data: orderCount, isLoading: countLoading, isError: countError, error: countErr } = useOrderCountStatsQuery(activeWindow)

  function handleWindowTab(tab: PeriodoTab) {
    if (tab === 'custom') {
      setShowPeriodoModal(true)
      return
    }

    setIsCustom(false)
    setActiveWindow(tab as StatsWindow)
  }

  function handleApplyPeriodo(start: Date, end: Date) {
    setCustomStart(start)
    setCustomEnd(end)
    setIsCustom(true)
    setShowPeriodoModal(false)
  }

  const xLabels = WINDOW_XLABELS[activeWindow]
  const periodoLabel = isCustom
    ? `${formatRangeDate(customStart)} - ${formatRangeDate(customEnd)}`
    : WINDOW_RANGE_LABEL[activeWindow]

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--space-margin-mobile)] py-12 md:px-[var(--space-margin-desktop)] md:py-16">
        <section className="mb-10">
          <nav
            aria-label="Breadcrumb"
            className="text-label-sm mb-6 flex items-center gap-2 text-[var(--color-secondary)]"
          >
            <Link to="/productor/pedidos" className="transition-colors hover:text-[var(--color-primary)]">
              Area Productor
            </Link>
            <ChevronRight size={14} strokeWidth={1.8} />
            <span className="text-[var(--color-primary)]">Estadisticas</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-display-lg mb-4 text-[var(--color-primary)]">Estadisticas</h1>
              <p className="text-body-md max-w-2xl text-[var(--color-on-surface-variant)]">
                Consulta el rendimiento comercial de tu tienda con una referencia temporal clara para cada metrica y tendencia mostrada.
              </p>
            </div>

            {/* Window selector */}
            <div className="inline-flex w-full max-w-full flex-wrap border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-surface-container-low)] p-1 sm:w-auto">
              {(['7d', '30d', '90d', '1y'] as StatsWindow[]).map((w) => {
                const isActive = !isCustom && activeWindow === w
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleWindowTab(w)}
                    className={`text-label-md flex items-center gap-1 px-4 py-3 transition-colors ${isActive ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                  >
                    {WINDOW_LABEL[w]}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => handleWindowTab('custom')}
                className={`text-label-md flex items-center gap-1 px-4 py-3 transition-colors ${isCustom ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
              >
                Personalizado
                <ChevronDown size={16} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </section>

        {/* Period context cards */}
        <section className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6">
            <p className="text-label-sm mb-2 uppercase tracking-[0.18em] text-[var(--color-secondary)]">
              Periodo seleccionado
            </p>
            <h2 className="text-headline-md text-[var(--color-on-surface)]">
              {isCustom ? 'Personalizado' : WINDOW_LABEL[activeWindow]}
            </h2>
            <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
              {isCustom
                ? 'Rango ajustado manualmente para consultas puntuales.'
                : WINDOW_SUBTITLE[activeWindow]}
            </p>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6">
            <div className="mb-3 flex items-center gap-3 text-[var(--color-primary)]">
              <CalendarDays size={20} strokeWidth={1.8} />
              <p className="text-label-sm uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                Rango consultado
              </p>
            </div>
            <h2 className="text-headline-md text-[var(--color-on-surface)]">{periodoLabel}</h2>
            <p className="text-body-md mt-2 text-[var(--color-on-surface-variant)]">
              Esta referencia temporal aplica a indicadores, grafico y listados de apoyo.
            </p>
          </article>
        </section>

        {/* KPI cards — backend-computed data, no client arithmetic */}
        <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3" aria-label="Indicadores clave">
          {/* Revenue KPI */}
          <div className="flex flex-col border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-8 transition-colors duration-300 hover:bg-[var(--color-surface-container-low)]">
            <span className="text-label-sm mb-4 uppercase tracking-[0.1em] text-[var(--color-secondary)]">
              Ingresos
            </span>
            {revLoading ? (
              <Loader2 size={22} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" />
            ) : revError ? (
              <span className="text-body-md text-[var(--color-error)]">
                {resolveErrorMessage(revErr)}
              </span>
            ) : (
              <>
                {/*
                  money-typing R2-R4: totalRevenue is a Decimal string from the backend.
                  NEVER do arithmetic on it — display only via formatMoney.
                */}
                <span className="text-headline-md mb-3 text-[var(--color-on-surface)]">
                  {revenue ? formatMoney(revenue.totalRevenue) : '—'}
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} strokeWidth={1.8} className="text-[var(--color-primary-container)]" />
                  <span className="text-body-md text-[var(--color-primary-container)]">
                    {revenue ? `Ventana: ${revenue.window}` : ''}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Order count KPI */}
          <div className="flex flex-col border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-8 transition-colors duration-300 hover:bg-[var(--color-surface-container-low)]">
            <span className="text-label-sm mb-4 uppercase tracking-[0.1em] text-[var(--color-secondary)]">
              Pedidos
            </span>
            {countLoading ? (
              <Loader2 size={22} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" />
            ) : countError ? (
              <span className="text-body-md text-[var(--color-error)]">
                {resolveErrorMessage(countErr)}
              </span>
            ) : (
              <>
                {/* count is an integer (not money) — safe to display as number */}
                <span className="text-headline-md mb-3 text-[var(--color-on-surface)]">
                  {orderCount ? String(orderCount.count) : '—'}
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} strokeWidth={1.8} className="text-[var(--color-primary-container)]" />
                  <span className="text-body-md text-[var(--color-primary-container)]">
                    {orderCount ? `Ventana: ${orderCount.window}` : ''}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Ticket medio — derived from backend values; shown as '—' until backend exposes it */}
          <div className="flex flex-col border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-8 transition-colors duration-300 hover:bg-[var(--color-surface-container-low)]">
            <span className="text-label-sm mb-4 uppercase tracking-[0.1em] text-[var(--color-secondary)]">
              Ticket medio
            </span>
            {revLoading || countLoading ? (
              <Loader2 size={22} strokeWidth={1.5} className="animate-spin text-[var(--color-primary)]" />
            ) : (
              <>
                {/*
                  money-typing R2: CANNOT compute ticket = revenue / count client-side
                  (that would be arithmetic on a Decimal string → violation).
                  The backend does not expose an averageTicket field in Cycle 2.
                  Show '—' until a dedicated backend field is added.
                */}
                <span className="text-headline-md mb-3 text-[var(--color-on-surface)]">—</span>
                <div className="flex items-center gap-2">
                  <TrendingDown size={16} strokeWidth={1.8} className="text-[var(--color-outline)]" />
                  <span className="text-body-md text-[var(--color-secondary)]">
                    No disponible en Ciclo 2
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Sales evolution chart — decorative SVG; real time-series data deferred (Cycle 3 / non-goal per spec) */}
        <section className="mb-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">Evolucion de ventas</h2>
            <p className="text-label-md text-[var(--color-secondary)]">Datos visualizados para: {periodoLabel}</p>
          </div>
          <div className="relative flex h-96 items-center justify-center border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-8 py-8 opacity-30">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-0 w-full border-b border-[var(--color-outline-variant)]" />
              ))}
            </div>

            <svg
              className="z-10 h-full w-full text-[var(--color-primary-container)]"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
              aria-label="Grafico de evolucion de ventas (datos ilustrativos)"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#chartGradient)"
                points="0,300 0,220 100,190 200,240 300,150 400,180 500,120 600,140 700,90 800,110 900,50 1000,70 1000,300"
              />
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,220 100,190 200,240 300,150 400,180 500,120 600,140 700,90 800,110 900,50 1000,70"
              />
              <circle cx="300" cy="150" r="4" fill="currentColor" className="cursor-pointer" />
              <circle cx="700" cy="90" r="4" fill="currentColor" className="cursor-pointer" />
              <circle cx="900" cy="50" r="4" fill="currentColor" className="cursor-pointer" />
            </svg>

            <div className="text-label-sm absolute bottom-2 left-0 flex w-full justify-between px-8 text-[var(--color-secondary)]">
              {xLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom section: recent orders (from pedidos hook, deferred — show empty state) */}
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Top products — non-goal in Cycle 2 spec; show deferred placeholder */}
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">
                Productos mas vendidos
              </h3>
              <Link
                to="/productor/productos"
                className="text-label-md text-[var(--color-primary)] hover:underline"
              >
                Ver catalogo
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--color-outline-variant)] py-14 text-center">
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                El ranking de productos más vendidos estará disponible en la próxima versión.
              </p>
              <p className="text-label-sm text-[var(--color-outline)]">
                (Non-goal en Ciclo 2 — sales-stats spec)
              </p>
            </div>
          </div>

          {/* Recent orders — deferred cross-reference to pedidos slice */}
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-headline-md text-[24px] text-[var(--color-on-surface)]">
                Pedidos recientes
              </h3>
              <Link
                to="/productor/pedidos"
                className="text-label-md text-[var(--color-primary)] hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--color-outline-variant)] py-14 text-center">
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                Consulta la lista completa de pedidos en la sección <strong>Mis pedidos</strong>.
              </p>
            </div>
          </div>
        </section>
      </main>

      {showPeriodoModal ? (
        <SeleccionPeriodoModal
          initialStart={customStart}
          initialEnd={customEnd}
          onClose={() => setShowPeriodoModal(false)}
          onApply={handleApplyPeriodo}
        />
      ) : null}
    </div>
  )
}
