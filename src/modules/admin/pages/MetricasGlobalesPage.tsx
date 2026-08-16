import { useState, type ReactNode } from 'react'
import { AlertTriangle, CalendarDays, CheckCircle, ChevronDown, Clock3, Loader2 } from 'lucide-react'
import { resolveErrorMessage } from '../../../lib/errorMessages'
import { SeleccionPeriodoModal } from '../../productor/componentes/SeleccionPeriodoModal'
import { useAdminCategoriesQuery } from '../catalogo/hooks/useAdminCategories'
import { useAdminMetricsIncidentsQuery } from '../metricas/hooks/useAdminMetricsIncidentsQuery'

type Period = '7d' | '30d' | '90d' | 'custom'

const PERIODS: Array<{ value: Period; label: string }> = [
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: '90d', label: '90 días' },
  { value: 'custom', label: 'Rango personalizado' },
]

const PERIOD_DAYS: Record<Exclude<Period, 'custom'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

function startOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

function endOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(23, 59, 59, 999)
  return value
}

function rollingStart(days: number, end: Date) {
  const start = new Date(end)
  start.setDate(start.getDate() - days)
  return start
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function MetricasGlobalesPage() {
  const [referenceNow] = useState(() => new Date())
  const [period, setPeriod] = useState<Period>('30d')
  const [showPeriodModal, setShowPeriodModal] = useState(false)
  const [customStart, setCustomStart] = useState(() => startOfDay(rollingStart(30, referenceNow)))
  const [customEnd, setCustomEnd] = useState(() => endOfDay(referenceNow))
  const incidentsQuery = useAdminMetricsIncidentsQuery()
  const categoriesQuery = useAdminCategoriesQuery()

  const rangeEnd = period === 'custom' ? endOfDay(customEnd) : referenceNow
  const rangeStart = period === 'custom' ? startOfDay(customStart) : rollingStart(PERIOD_DAYS[period], rangeEnd)
  const incidents = (incidentsQuery.data ?? []).filter((incident) => {
    const createdAt = new Date(incident.createdAt).getTime()
    return Number.isFinite(createdAt) && createdAt >= rangeStart.getTime() && createdAt <= rangeEnd.getTime()
  })
  const resolved = incidents.filter((incident) => incident.status === 'RESOLVED')
  const open = incidents.filter((incident) => incident.status === 'OPEN')
  const resolutionRate = incidents.length > 0 ? Math.round((resolved.length * 100) / incidents.length) : null

  const categories = [...(categoriesQuery.data ?? [])]
    .filter((category) => category.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name))
  const catalogTotal = categories.reduce((total, category) => total + category.productCount, 0)

  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-display-lg mb-2 max-w-2xl text-[var(--color-on-surface)]">Métricas globales del sistema</h2>
          <p className="text-body-lg text-[var(--color-secondary)]">
            Incidencias creadas entre {formatDate(rangeStart)} y {formatDate(rangeEnd)}, límites incluidos.
          </p>
        </div>
        <div className="inline-flex w-full max-w-full flex-wrap border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-surface-container-low)] p-1 sm:w-auto">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                if (value === 'custom') {
                  setShowPeriodModal(true)
                  return
                }
                setPeriod(value)
              }}
              className={`text-label-md flex items-center gap-1 px-4 py-3 transition-colors ${period === value ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
            >
              {label}
              {value === 'custom' ? <ChevronDown size={16} strokeWidth={1.8} /> : null}
            </button>
          ))}
        </div>
      </header>

      <section className="mb-12" aria-labelledby="incidents-heading">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays size={22} strokeWidth={1.8} className="text-[var(--color-primary)]" />
          <div>
            <h3 id="incidents-heading" className="text-headline-lg text-[var(--color-primary)]">Incidencias del período</h3>
            <p className="text-body-md mt-1 text-[var(--color-secondary)]">Estado actual de las incidencias creadas dentro del rango seleccionado.</p>
          </div>
        </div>
        {incidentsQuery.isLoading ? (
          <LoadingState label="Cargando incidencias..." />
        ) : incidentsQuery.isError ? (
          <ErrorState message={resolveErrorMessage(incidentsQuery.error)} />
        ) : incidents.length === 0 ? (
          <EmptyState message="No se registraron incidencias en este período." />
        ) : (
          <div className="grid grid-cols-1 gap-[var(--space-gutter)] sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={<AlertTriangle size={22} strokeWidth={1.8} />} label="Registradas" value={String(incidents.length)} detail="Creadas dentro del período" />
            <MetricCard icon={<Clock3 size={22} strokeWidth={1.8} />} label="Abiertas" value={String(open.length)} detail="Estado actual: OPEN" />
            <MetricCard icon={<CheckCircle size={22} strokeWidth={1.8} />} label="Resueltas" value={String(resolved.length)} detail="Estado actual: RESOLVED" />
            <MetricCard icon={<CheckCircle size={22} strokeWidth={1.8} />} label="Tasa de resolución" value={resolutionRate === null ? '—' : `${resolutionRate}%`} detail="Resueltas / registradas en el período" />
          </div>
        )}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6 md:p-8" aria-labelledby="catalog-heading">
        <div className="mb-8 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pb-4">
          <h3 id="catalog-heading" className="text-headline-lg text-[var(--color-primary)]">Distribución del catálogo</h3>
          <p className="text-body-md mt-2 text-[var(--color-secondary)]">Productos activos actuales por categoría. Esta distribución no representa ventas.</p>
        </div>
        {categoriesQuery.isLoading ? (
          <LoadingState label="Cargando categorías..." />
        ) : categoriesQuery.isError ? (
          <ErrorState message={resolveErrorMessage(categoriesQuery.error)} />
        ) : categories.length === 0 || catalogTotal === 0 ? (
          <EmptyState message="No hay productos activos distribuidos por categoría." />
        ) : (
          <div className="space-y-7">
            {categories.map((category) => {
              const percent = Math.round((category.productCount * 100) / catalogTotal)
              return (
                <div key={category.id} className="grid grid-cols-[minmax(6rem,10rem)_1fr_5.5rem] items-center gap-4">
                  <span className="text-label-md truncate text-[var(--color-on-surface)]">{category.name}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]">
                    <span className="block h-full rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_70%,var(--color-on-surface))]" style={{ width: `${percent}%` }} />
                  </span>
                  <span className="text-body-md text-right text-[var(--color-secondary)]">{category.productCount} prod.</span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* <aside className="text-body-md mt-[var(--space-gutter)] border-l-4 border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5 text-[var(--color-on-surface-variant)]">
        Las métricas de usuarios, productores activos, pedidos globales, volumen de transacciones y rankings comerciales no están disponibles porque el backend no expone contratos estables para esos datos.
      </aside> */}

      {showPeriodModal ? (
        <SeleccionPeriodoModal
          initialStart={customStart}
          initialEnd={customEnd}
          onClose={() => setShowPeriodModal(false)}
          onApply={(start, end) => {
            setCustomStart(startOfDay(start))
            setCustomEnd(endOfDay(end))
            setPeriod('custom')
            setShowPeriodModal(false)
          }}
        />
      ) : null}
    </div>
  )
}

function MetricCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return (
    <article className="flex min-h-40 flex-col justify-between rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3 text-[var(--color-secondary)]"><p className="text-label-md">{label}</p>{icon}</div>
        <p className="text-headline-md text-[var(--color-on-surface)]">{value}</p>
      </div>
      <p className="text-label-sm mt-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-4 text-[var(--color-on-surface-variant)]">{detail}</p>
    </article>
  )
}

function LoadingState({ label }: { label: string }) {
  return <div className="flex min-h-36 items-center justify-center gap-3 border border-[var(--color-outline-variant)] text-[var(--color-secondary)]"><Loader2 className="animate-spin" size={22} /><span>{label}</span></div>
}

function ErrorState({ message }: { message: string }) {
  return <div role="alert" className="border border-[var(--color-error)] bg-[var(--color-error-container)] p-6 text-[var(--color-on-error-container)]">{message}</div>
}

function EmptyState({ message }: { message: string }) {
  return <div className="border border-dashed border-[var(--color-outline-variant)] p-10 text-center text-[var(--color-on-surface-variant)]">{message}</div>
}
