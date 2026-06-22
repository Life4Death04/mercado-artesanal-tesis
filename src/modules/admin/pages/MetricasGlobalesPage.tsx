import { AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react'

const kpis = [
  { label: 'Usuarios registrados', value: '1.240', detail: '850 Clientes / 390 Productores' },
  { label: 'Productores activos', value: '85', detail: 'Con al menos un producto publicado' },
  { label: 'Pedidos procesados', value: '412', detail: 'En el periodo seleccionado' },
  { label: 'Volumen de transacciones', value: '€ 24.500', detail: 'Ventas totales brutas' },
]

const categories = [
  { name: 'Aceites', percent: 45, width: '85%' },
  { name: 'Quesos', percent: 30, width: '65%' },
  { name: 'Vinos', percent: 15, width: '45%' },
  { name: 'Embutidos', percent: 10, width: '25%' },
]

const periods = ['Semana', 'Mes', 'Trimestre']

export function MetricasGlobalesPage() {
  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-display-lg mb-2 max-w-2xl text-[var(--color-on-surface)]">
            Métricas globales del sistema
          </h2>
          <p className="text-body-lg text-[var(--color-secondary)]">Mes actual: Octubre 2023</p>
        </div>

        <div className="inline-flex w-full max-w-full flex-wrap border border-[color-mix(in_srgb,var(--color-outline-variant)_55%,transparent)] bg-[var(--color-surface-container-low)] p-1 sm:w-auto">
          {periods.map((period) => (
            <button
              key={period}
              type="button"
              className={`text-label-md px-4 py-3 transition-colors ${
                period === 'Mes'
                  ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary)] shadow-sm'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              {period}
            </button>
          ))}
          <button
            type="button"
            className="text-label-md flex items-center gap-1 px-4 py-3 text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)]"
          >
            Rango personalizado
            <ChevronDown size={16} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <section className="mb-20 grid grid-cols-1 gap-[var(--space-gutter)] md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
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
            {categories.map((category) => (
              <div key={category.name} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-4 sm:grid-cols-[8rem_1fr_4rem]">
                <span className="text-label-md truncate text-[var(--color-on-surface)]">{category.name}</span>
                <span className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-container-highest)]">
                  <span
                    className="block h-full rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_70%,var(--color-on-surface))]"
                    style={{ width: category.width }}
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
          <div className="flex flex-1 flex-col justify-center gap-8">
            <div className="flex items-center justify-between bg-[var(--color-surface-bright)] p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={22} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                <span className="text-body-md text-[var(--color-on-surface)]">Registradas</span>
              </div>
              <span className="text-headline-md text-[var(--color-primary)]">12</span>
            </div>
            <div className="flex items-center justify-between bg-[var(--color-surface-bright)] p-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={22} strokeWidth={1.8} className="text-[var(--color-secondary)]" />
                <span className="text-body-md text-[var(--color-on-surface)]">Resueltas</span>
              </div>
              <span className="text-headline-md text-[var(--color-on-surface)]">8</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
