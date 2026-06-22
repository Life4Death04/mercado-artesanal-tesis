import { Link } from 'react-router-dom'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ListFilter, Search, SlidersHorizontal } from 'lucide-react'

type IncidentStatus = 'Pendiente' | 'En revisión' | 'Resuelta'

type IncidentRow = {
  id: string
  slug: string
  type: string
  reporter: string
  reporterEmail: string
  reported: string
  reportedRole: string
  description: string
  date: string
  status: IncidentStatus
}

const incidents: IncidentRow[] = [
  {
    id: '#INC-2841',
    slug: 'inc-2841',
    type: 'Reclamación',
    reporter: 'Elena Ríos',
    reporterEmail: 'elena.r@email.com',
    reported: 'Cerámica Valls',
    reportedRole: 'Vendedor',
    description: 'El jarrón de terracota llegó con una fisura en la base, a pesar del embalaje.',
    date: '12 Oct 2023',
    status: 'Pendiente',
  },
  {
    id: '#INC-2838',
    slug: 'inc-2838',
    type: 'Denuncia',
    reporter: 'Carlos M.',
    reporterEmail: 'carlos.m@email.com',
    reported: 'Mieles del Valle',
    reportedRole: 'Vendedor',
    description: 'Sospecho que el producto no es 100% orgánico como indica la etiqueta.',
    date: '10 Oct 2023',
    status: 'En revisión',
  },
  {
    id: '#INC-2815',
    slug: 'inc-2815',
    type: 'Reclamación',
    reporter: 'Ana G.',
    reporterEmail: 'ana.g@email.com',
    reported: 'Textiles Oax',
    reportedRole: 'Vendedor',
    description: 'El pedido lleva 3 semanas de retraso y el vendedor no responde.',
    date: '05 Oct 2023',
    status: 'Resuelta',
  },
]

export function IncidenciasAdminPage() {
  return (
    <div className="mx-[var(--space-margin-mobile)] max-w-[var(--layout-container-max)] md:mx-0">
      <header className="mb-12">
        <h1 className="text-headline-lg mb-2 text-[var(--color-on-surface)]">Gestión de Incidencias</h1>
        <p className="text-body-md max-w-2xl text-[var(--color-outline)]">
          Supervise, revise y resuelva las incidencias reportadas en la plataforma para mantener la calidad y seguridad
          de Artisan Marketplace.
        </p>
      </header>

      <section className="mb-8 flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-background)_72%,transparent)] p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
        <label className="relative min-w-[250px] flex-1">
          <span className="sr-only">Buscar incidencia</span>
          <Search
            size={20}
            strokeWidth={1.8}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-outline)]"
          />
          <input
            type="search"
            placeholder="Buscar por ID, usuario..."
            className="text-body-md w-full border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-transparent py-2 pr-4 pl-10 text-[var(--color-on-surface)] transition-colors placeholder:text-[color-mix(in_srgb,var(--color-outline)_70%,transparent)] focus:border-[var(--color-on-surface)] focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <FilterButton icon={ListFilter} label="Tipo: Todos" />
          <FilterButton icon={SlidersHorizontal} label="Estado: Todos" />
          <FilterButton icon={CalendarDays} label="Últimos 30 días" />
        </div>
      </section>

      <section className="overflow-x-auto" aria-label="Listado de incidencias">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)]">
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Reportante</TableHead>
              <TableHead>Reportado</TableHead>
              <TableHead className="w-1/4">Descripción</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </tr>
          </thead>
          <tbody className="text-body-md">
            {incidents.map((incident) => (
              <tr
                key={incident.id}
                className="group border-b border-[color-mix(in_srgb,var(--color-on-surface)_10%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-container-low)_55%,transparent)]"
              >
                <td className="px-4 py-6 text-[18px] font-semibold text-[var(--color-on-surface)]">
                  <span className="font-editorial">{incident.id}</span>
                </td>
                <td className="px-4 py-6">
                  <span className="text-label-sm inline-block rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] bg-[var(--color-surface-container)] px-3 py-1 text-[var(--color-on-surface)]">
                    {incident.type}
                  </span>
                </td>
                <td className="px-4 py-6">
                  <div className="font-medium text-[var(--color-on-surface)]">{incident.reporter}</div>
                  <div className="mt-1 text-sm text-[var(--color-outline)]">{incident.reporterEmail}</div>
                </td>
                <td className="px-4 py-6">
                  <div className="text-[var(--color-on-surface)]">{incident.reported}</div>
                  <div className="mt-1 text-sm text-[var(--color-outline)]">{incident.reportedRole}</div>
                </td>
                <td className="px-4 py-6">
                  <p className="max-w-xs truncate text-[var(--color-on-surface)]">{incident.description}</p>
                </td>
                <td className="px-4 py-6 text-[var(--color-outline)]">{incident.date}</td>
                <td className="px-4 py-6">
                  <StatusBadge status={incident.status} />
                </td>
                <td className="px-4 py-6 text-right">
                  <Link
                    to={`/admin/incidencias/${incident.slug}`}
                    className={`text-label-md inline-flex px-4 py-2 transition-colors ${
                      incident.status === 'Resuelta'
                        ? 'border border-transparent text-[var(--color-outline)] hover:text-[var(--color-on-surface)]'
                        : 'border border-[var(--color-on-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-on-surface)] hover:text-[var(--color-surface)]'
                    }`}
                  >
                    {incident.status === 'Resuelta' ? 'Ver detalle' : 'Revisar'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="mt-8 flex flex-col gap-6 border-t border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] pt-6 md:flex-row md:items-center md:justify-between">
        <span className="text-body-md text-[var(--color-outline)]">Mostrando 1-10 de 42 incidencias</span>
        <div className="flex items-center gap-2">
          <PaginationButton icon={ChevronLeft} label="Página anterior" disabled />
          <button
            type="button"
            aria-current="page"
            className="text-label-md grid size-10 place-items-center border border-[var(--color-on-surface)] bg-[var(--color-on-surface)] text-[var(--color-surface)]"
          >
            1
          </button>
          <PaginationButton label="2" />
          <PaginationButton label="3" />
          <span className="px-2 text-[var(--color-outline)]">...</span>
          <PaginationButton icon={ChevronRight} label="Página siguiente" />
        </div>
      </footer>
    </div>
  )
}

type FilterButtonProps = {
  icon: typeof ListFilter
  label: string
}

function FilterButton({ icon: Icon, label }: FilterButtonProps) {
  return (
    <button
      type="button"
      className="text-label-md flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] px-4 py-2 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)]"
    >
      <Icon size={15} strokeWidth={1.9} />
      {label}
      <ChevronDown size={15} strokeWidth={1.9} />
    </button>
  )
}

type TableHeadProps = {
  children: string
  className?: string
}

function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <th className={`text-label-md px-4 py-4 uppercase tracking-wider text-[var(--color-outline)] ${className}`}>
      {children}
    </th>
  )
}

type StatusBadgeProps = {
  status: IncidentStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const className = {
    Pendiente:
      'border-[color-mix(in_srgb,var(--color-primary-container)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-error-container)_30%,transparent)] text-[var(--color-primary-container)]',
    'En revisión':
      'border-[color-mix(in_srgb,var(--color-secondary)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-secondary-container)_50%,transparent)] text-[var(--color-secondary)]',
    Resuelta:
      'border-[color-mix(in_srgb,var(--color-outline-variant)_50%,transparent)] bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]',
  }[status]

  return <span className={`text-label-sm inline-block rounded-full border px-3 py-1 ${className}`}>{status}</span>
}

type PaginationButtonProps = {
  label: string
  icon?: typeof ChevronLeft
  disabled?: boolean
}

function PaginationButton({ label, icon: Icon, disabled = false }: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label.length > 1 ? label : `Página ${label}`}
      disabled={disabled}
      className="text-label-md grid size-10 place-items-center border border-[color-mix(in_srgb,var(--color-secondary)_45%,transparent)] text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container-low)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon ? <Icon size={18} strokeWidth={1.8} /> : label}
    </button>
  )
}
