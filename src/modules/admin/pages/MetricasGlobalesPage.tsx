import { useState } from 'react'
import { AlertTriangle, CheckCircle, ChevronDown, TrendingUp, Users } from 'lucide-react'
import { SeleccionPeriodoModal } from '../../productor/componentes/SeleccionPeriodoModal'

type Periodo = 'Semana' | 'Mes' | 'Trimestre' | 'Rango personalizado'

type Kpi = {
  label: string
  value: string
  detail: string
}

type CategoryMetric = {
  name: string
  percent: number
}

type ProducerMetric = {
  name: string
  orders: number
  volume: string
  status: 'Activo' | 'Observación'
}

type MetricsDataset = {
  subtitle: string
  kpis: Kpi[]
  categories: CategoryMetric[]
  incidents: {
    registered: number
    resolved: number
    pending: number
  }
  producers: ProducerMetric[]
}

const periods: Periodo[] = ['Semana', 'Mes', 'Trimestre', 'Rango personalizado']

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function formatRangeDate(date: Date) {
  return `${date.getDate()} ${MESES_CORTOS[date.getMonth()]} ${date.getFullYear()}`
}

const datasets: Record<Periodo, MetricsDataset> = {
  Semana: {
    subtitle: 'Semana actual: 25–31 Mayo 2026',
    kpis: [
      { label: 'Usuarios registrados', value: '124', detail: '82 Clientes / 42 Productores' },
      { label: 'Productores activos', value: '58', detail: 'Con actividad entre el 25 y 31 de mayo' },
      { label: 'Pedidos procesados', value: '96', detail: 'Pedidos cerrados durante la semana' },
      { label: 'Volumen de transacciones', value: '€ 6.480', detail: 'Ventas totales brutas' },
      { label: 'Nuevos registros', value: '27', detail: '+9% frente a la semana anterior' },
      { label: 'Tasa de resolución', value: '76%', detail: 'Incidencias resueltas en el período' },
    ],
    categories: [
      { name: 'Aceites', percent: 38 },
      { name: 'Quesos', percent: 26 },
      { name: 'Vinos', percent: 18 },
      { name: 'Dulces', percent: 11 },
      { name: 'Mieles', percent: 7 },
    ],
    incidents: { registered: 7, resolved: 5, pending: 2 },
    producers: [
      { name: 'Finca El Olivar', orders: 18, volume: '€ 1.240', status: 'Activo' },
      { name: 'Bodegas del Sol', orders: 14, volume: '€ 980', status: 'Activo' },
      { name: 'Quesos de Montaña', orders: 11, volume: '€ 740', status: 'Activo' },
      { name: 'Miel de Guadalest', orders: 8, volume: '€ 430', status: 'Observación' },
    ],
  },
  Mes: {
    subtitle: 'Mes actual: Mayo 2026',
    kpis: [
      { label: 'Usuarios registrados', value: '1.482', detail: '1.026 Clientes / 456 Productores' },
      { label: 'Productores activos', value: '112', detail: 'Con al menos un producto publicado' },
      { label: 'Pedidos procesados', value: '538', detail: 'En el periodo seleccionado' },
      { label: 'Volumen de transacciones', value: '€ 31.850', detail: 'Ventas totales brutas' },
      { label: 'Nuevos registros', value: '168', detail: '+10% respecto a abril de 2026' },
      { label: 'Tasa de resolución', value: '71%', detail: 'Incidencias resueltas este mes' },
    ],
    categories: [
      { name: 'Aceites', percent: 45 },
      { name: 'Quesos', percent: 30 },
      { name: 'Vinos', percent: 15 },
      { name: 'Embutidos', percent: 10 },
      { name: 'Dulces', percent: 8 },
    ],
    incidents: { registered: 12, resolved: 8, pending: 4 },
    producers: [
      { name: 'Finca El Olivar', orders: 82, volume: '€ 5.420', status: 'Activo' },
      { name: 'Bodegas del Sol', orders: 71, volume: '€ 4.980', status: 'Activo' },
      { name: 'Aceites Benitatxell', orders: 54, volume: '€ 3.610', status: 'Activo' },
      { name: 'Dulces Artesanos', orders: 37, volume: '€ 2.150', status: 'Observación' },
    ],
  },
  Trimestre: {
    subtitle: 'Trimestre actual: Marzo–Mayo 2026',
    kpis: [
      { label: 'Usuarios registrados', value: '4.260', detail: '3.040 Clientes / 1.220 Productores' },
      { label: 'Productores activos', value: '246', detail: 'Con ventas o catálogo activo' },
      { label: 'Pedidos procesados', value: '1.534', detail: 'Pedidos cerrados entre marzo y mayo' },
      { label: 'Volumen de transacciones', value: '€ 96.400', detail: 'Ventas totales brutas' },
      { label: 'Nuevos registros', value: '512', detail: '+16% frente al trimestre anterior' },
      { label: 'Tasa de resolución', value: '78%', detail: 'Incidencias resueltas en menos de 72h' },
    ],
    categories: [
      { name: 'Aceites', percent: 41 },
      { name: 'Vinos', percent: 25 },
      { name: 'Quesos', percent: 21 },
      { name: 'Conservas', percent: 9 },
      { name: 'Frutos Secos', percent: 4 },
    ],
    incidents: { registered: 48, resolved: 36, pending: 12 },
    producers: [
      { name: 'Bodegas del Sol', orders: 248, volume: '€ 18.200', status: 'Activo' },
      { name: 'Finca El Olivar', orders: 221, volume: '€ 15.780', status: 'Activo' },
      { name: 'Vinos El Mediterráneo', orders: 196, volume: '€ 13.450', status: 'Activo' },
      { name: 'Quesos de Montaña', orders: 143, volume: '€ 8.310', status: 'Observación' },
    ],
  },
  'Rango personalizado': {
    subtitle: 'Rango personalizado: 01 Marzo–31 Mayo 2026',
    kpis: [
      { label: 'Usuarios registrados', value: '2.040', detail: '1.436 Clientes / 604 Productores' },
      { label: 'Productores activos', value: '154', detail: 'Actividad detectada en el rango' },
      { label: 'Pedidos procesados', value: '742', detail: 'Pedidos cerrados en el rango' },
      { label: 'Volumen de transacciones', value: '€ 46.950', detail: 'Ventas totales brutas' },
      { label: 'Nuevos registros', value: '286', detail: 'Altas registradas durante el rango' },
      { label: 'Tasa de resolución', value: '73%', detail: 'Incidencias resueltas en el rango' },
    ],
    categories: [
      { name: 'Aceites', percent: 43 },
      { name: 'Quesos', percent: 27 },
      { name: 'Vinos', percent: 19 },
      { name: 'Dulces', percent: 7 },
      { name: 'Embutidos', percent: 4 },
    ],
    incidents: { registered: 21, resolved: 14, pending: 7 },
    producers: [
      { name: 'Finca El Olivar', orders: 126, volume: '€ 8.750', status: 'Activo' },
      { name: 'Bodegas del Sol', orders: 118, volume: '€ 8.100', status: 'Activo' },
      { name: 'Aceites Benitatxell', orders: 73, volume: '€ 4.930', status: 'Activo' },
      { name: 'Miel de Guadalest', orders: 44, volume: '€ 2.490', status: 'Observación' },
    ],
  },
}

export function MetricasGlobalesPage() {
  const [periodo, setPeriodo] = useState<Periodo>('Mes')
  const [showPeriodoModal, setShowPeriodoModal] = useState(false)
  const [customStart, setCustomStart] = useState(new Date(2026, 2, 1))
  const [customEnd, setCustomEnd] = useState(new Date(2026, 4, 31))

  const data = periodo === 'Rango personalizado'
    ? {
        ...datasets[periodo],
        subtitle: `Rango personalizado: ${formatRangeDate(customStart)} — ${formatRangeDate(customEnd)}`,
      }
    : datasets[periodo]

  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-display-lg mb-2 max-w-2xl text-[var(--color-on-surface)]">
            Métricas globales del sistema
          </h2>
          <p className="text-body-lg text-[var(--color-secondary)]">{data.subtitle}</p>
        </div>

        <div className="inline-flex w-full max-w-full flex-wrap border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-surface-container-low)] p-1 sm:w-auto">
          {periods.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => {
                if (period === 'Rango personalizado') {
                  setShowPeriodoModal(true)
                  return
                }
                setPeriodo(period)
              }}
              className={`text-label-md flex items-center gap-1 px-4 py-3 transition-colors ${
                period === periodo
                  ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)] shadow-sm'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              {period}
              {period === 'Rango personalizado' && <ChevronDown size={16} strokeWidth={1.8} />}
            </button>
          ))}
        </div>
      </header>

      <section className="mb-20 grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2 xl:grid-cols-3">
        {data.kpis.map((kpi) => (
          <article
            key={kpi.label}
            className="flex min-h-40 flex-col justify-between rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-6"
          >
            <div>
              <p className="text-label-md mb-3 text-[var(--color-secondary)]">{kpi.label}</p>
              <p className="text-headline-md text-[var(--color-on-surface)]">{kpi.value}</p>
            </div>
            <p className="text-label-sm mt-4 border-t border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pt-4 text-[var(--color-on-surface-variant)]">
              {kpi.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-[var(--space-gutter)] xl:grid-cols-12">
        <article className="rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-8 xl:col-span-8">
          <h3 className="text-headline-lg mb-8 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pb-4 text-[var(--color-primary)]">
            Categorías más vendidas
          </h3>
          <div className="space-y-8">
            {data.categories.map((category) => (
              <div key={category.name} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-4 sm:grid-cols-[8rem_1fr_4rem]">
                <span className="text-label-md truncate text-[var(--color-on-surface)]">{category.name}</span>
                <span className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]">
                  <span
                    className="block h-full rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_70%,var(--color-on-surface))]"
                    style={{ width: `${category.percent}%` }}
                  />
                </span>
                <span className="text-body-md text-right text-[var(--color-secondary)]">{category.percent}%</span>
              </div>
            ))}
          </div>
        </article>

        <article className="flex flex-col rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-8 xl:col-span-4">
          <h3 className="text-headline-lg mb-8 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pb-4 text-[var(--color-primary)]">
            Incidencias del período
          </h3>
          <div className="flex flex-1 flex-col justify-center gap-6">
            <MetricRow icon={<AlertTriangle size={22} strokeWidth={1.8} />} label="Registradas" value={data.incidents.registered} tone="primary" />
            <MetricRow icon={<CheckCircle size={22} strokeWidth={1.8} />} label="Resueltas" value={data.incidents.resolved} />
            <MetricRow icon={<TrendingUp size={22} strokeWidth={1.8} />} label="Pendientes" value={data.incidents.pending} tone="secondary" />
          </div>
        </article>
      </section>

      <section className="mt-[var(--space-gutter)] rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--color-outline-variant)_35%,transparent)] bg-[var(--color-surface-container-low)] p-8">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)] pb-4">
          <h3 className="text-headline-lg text-[var(--color-primary)]">Productores destacados</h3>
          <Users size={22} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[color-mix(in_srgb,var(--color-outline-variant)_45%,transparent)]">
                <TableHead>Productor</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Volumen</TableHead>
                <TableHead>Estado</TableHead>
              </tr>
            </thead>
            <tbody>
              {data.producers.map((producer) => (
                <tr key={producer.name} className="border-b border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] last:border-b-0">
                  <td className="px-4 py-5 text-body-md font-medium text-[var(--color-on-surface)]">{producer.name}</td>
                  <td className="px-4 py-5 text-body-md text-[var(--color-secondary)]">{producer.orders}</td>
                  <td className="px-4 py-5 text-body-md font-semibold text-[var(--color-on-surface)]">{producer.volume}</td>
                  <td className="px-4 py-5">
                    <span
                      className={`text-label-sm rounded-full px-3 py-1 ${
                        producer.status === 'Activo'
                          ? 'bg-[#e8f5e9] text-[#2e7d32]'
                          : 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]'
                      }`}
                    >
                      {producer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showPeriodoModal && (
        <SeleccionPeriodoModal
          initialStart={customStart}
          initialEnd={customEnd}
          onClose={() => setShowPeriodoModal(false)}
          onApply={(start, end) => {
            setCustomStart(start)
            setCustomEnd(end)
            setPeriodo('Rango personalizado')
          }}
        />
      )}
    </div>
  )
}

function MetricRow({
  icon,
  label,
  value,
  tone = 'default',
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone?: 'default' | 'primary' | 'secondary'
}) {
  const valueClass = {
    default: 'text-[var(--color-on-surface)]',
    primary: 'text-[var(--color-primary)]',
    secondary: 'text-[var(--color-secondary)]',
  }[tone]

  return (
    <div className="flex items-center justify-between bg-[var(--color-surface-bright)] p-4">
      <div className="flex items-center gap-3 text-[var(--color-secondary)]">
        {icon}
        <span className="text-body-md text-[var(--color-on-surface)]">{label}</span>
      </div>
      <span className={`text-headline-md ${valueClass}`}>{value}</span>
    </div>
  )
}

function TableHead({ children }: { children: string }) {
  return (
    <th className="text-label-md px-4 py-4 uppercase tracking-wider text-[var(--color-secondary)]">
      {children}
    </th>
  )
}
